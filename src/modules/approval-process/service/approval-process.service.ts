import { BadRequestError } from "../../../commons/errors/bad-request.error";
import { ConflictError } from "../../../commons/errors/conflict.error";
import { ForbiddenError } from "../../../commons/errors/forbidden.error";
import { NotFoundError } from "../../../commons/errors/not-found.error";
import { hasPermission } from "../../../commons/utils/auth";
import { createDocumentSignature } from "../../../commons/utils/signature";
import { instantToEpochMilliseconds, toInstant } from "../../../commons/utils/temporal";
import { approvalProcessRepository } from "../repository/approval-process.repository";

type CreateApprovalProcessInput = {
  templateCode: string;
  referenceId: string;
  villageId?: string;
  banjarId?: string;
  templateVersion?: number;
};

type ApproveProcessInput = {
  referenceId: string;
  userId: string;
  auth: unknown;
  pin: string;
  letterNumber?: string;
  letterDate?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
};

type FinalSignInput = {
  referenceId: string;
  userId: string;
  fileKey: string;
  documentHash: string;
  mimeType?: string;
  fileSize?: number;
  certificateSerial?: string;
  certificateIssuer?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
};

const SIGNABLE_STATUSES = ["READY_TO_SIGN", "PROCESSING"];

export class ApprovalProcessService {
  async findAll() {
    return approvalProcessRepository.findAll();
  }

  async create(input: CreateApprovalProcessInput, actorUserId: string) {
    const existing = await approvalProcessRepository.findByReferenceId(input.referenceId);

    if (existing) {
      throw new ConflictError("Approval process reference already exists");
    }

    const template = await approvalProcessRepository.findActiveTemplate(
      input.templateCode,
      input.templateVersion
    );

    if (!template) {
      throw new NotFoundError("Signing template not found");
    }

    const steps = await approvalProcessRepository.findTemplateSteps(template.id);

    if (steps.length === 0) {
      throw new BadRequestError("Signing template does not have approval steps");
    }

    return approvalProcessRepository.executeCreateTransaction(
      input,
      template,
      steps,
      actorUserId
    );
  }

  async approve(input: ApproveProcessInput) {
    const signRequest = await approvalProcessRepository.findByReferenceId(input.referenceId);

    if (!signRequest) {
      throw new NotFoundError("Approval process not found");
    }

    if (signRequest.status !== "IN_PROGRESS" && signRequest.status !== "PENDING") {
      throw new ConflictError("Approval process is not waiting for approval");
    }

    const approval = await approvalProcessRepository.findPendingApprovalStep(
      signRequest.id,
      signRequest.currentSequence
    );

    if (!approval) {
      throw new NotFoundError("Current approval step not found");
    }

    if (approval.status !== "PENDING") {
      throw new ConflictError("Current approval step has already been processed");
    }

    if (!hasPermission(input.auth, approval.permission)) {
      throw new ForbiddenError("User does not have permission for this approval step");
    }

    const credential = await approvalProcessRepository.findSignerCredential(input.userId);

    if (!credential || !credential.active) {
      throw new ForbiddenError("Signer PIN has not been configured");
    }

    if (credential.lockedUntil && instantToEpochMilliseconds(credential.lockedUntil) > Date.now()) {
      throw new ForbiddenError("Signer PIN is temporarily locked");
    }

    const pinIsValid = await Bun.password.verify(input.pin, credential.pinHash);

    if (!pinIsValid) {
      const failedAttempt = credential.failedAttempt + 1;
      const lockedUntil = failedAttempt >= 5
        ? toInstant(Date.now() + 15 * 60 * 1000)
        : null;

      await approvalProcessRepository.incrementFailedAttempt(
        input.userId,
        failedAttempt,
        lockedUntil
      );

      await approvalProcessRepository.logAudit({
        signRequestId: signRequest.id,
        actorUserId: input.userId,
        action: "PIN_VERIFICATION_FAILED",
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        metadata: {
          sequence: approval.sequence,
          level: approval.level,
          failedAttempt,
        },
      });

      throw new ForbiddenError("Invalid signer PIN");
    }

    const letterDate = input.letterDate ? new Date(input.letterDate) : null;

    if (input.letterDate && Number.isNaN(letterDate?.getTime())) {
      throw new BadRequestError("Invalid letterDate");
    }

    const pendingApprovals = await approvalProcessRepository.findNextPendingApprovals(
      signRequest.id,
      signRequest.currentSequence
    );

    const nextApproval = pendingApprovals[0] ?? null;
    const nextStatus = nextApproval ? "IN_PROGRESS" : "READY_TO_SIGN";

    return approvalProcessRepository.executeApproveTransaction(
      signRequest.id,
      approval.id,
      input.userId,
      input,
      nextApproval,
      nextStatus,
      signRequest.currentSequence
    );
  }

  async finalSign(input: FinalSignInput) {
    const signRequest = await approvalProcessRepository.findByReferenceId(input.referenceId);

    if (!signRequest) {
      throw new NotFoundError("Approval process not found");
    }

    if (!SIGNABLE_STATUSES.includes(signRequest.status)) {
      throw new ConflictError("Approval process is not ready to sign");
    }

    const approvals = await approvalProcessRepository.findApprovedApprovals(signRequest.id);

    if (approvals.length === 0) {
      throw new BadRequestError("Approval process does not have approved approvals");
    }

    const pendingRequiredApproval = await approvalProcessRepository.findPendingRequiredApproval(signRequest.id);

    if (pendingRequiredApproval) {
      throw new ConflictError("Approval process still has pending required approvals");
    }

    const signatureValues = await Promise.all(
      approvals.map(async (approval) => {
        if (!approval.signerUserId) {
          throw new ConflictError("Approved approval is missing signer user");
        }
        const signatureValue = await createDocumentSignature([
          input.documentHash,
          signRequest.referenceId,
          approval.id,
          approval.signerUserId,
          approval.level,
        ].join(":"));
        
        return {
          approvalId: approval.id,
          value: signatureValue
        };
      })
    );

    return approvalProcessRepository.executeFinalSignTransaction(
      signRequest,
      approvals,
      input,
      signatureValues
    );
  }
}

export const approvalProcessService = new ApprovalProcessService();
