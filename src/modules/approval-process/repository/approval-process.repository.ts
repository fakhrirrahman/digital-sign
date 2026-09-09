import { db } from "../../../prisma/db";
import { nowInstant, toInstant, type InstantLike } from "../../../commons/utils/temporal";

export type SignRequestStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "READY_TO_SIGN"
  | "PROCESSING"
  | "SIGNED"
  | "REJECTED"
  | "FAILED"
  | "CANCELLED";

export class ApprovalProcessRepository {
  async findAll() {
    return db.orm.public.SignRequest
      .orderBy((request) => request.createdAt.desc())
      .all();
  }

  async findByReferenceId(referenceId: string) {
    return db.orm.public.SignRequest
      .where({ referenceId })
      .first();
  }

  async findActiveTemplate(templateCode: string, templateVersion?: number) {
    const query = db.orm.public.SigningTemplate.where({
      code: templateCode,
      active: true,
    });

    if (templateVersion) {
      return query.where({ version: templateVersion }).first();
    }

    return query.orderBy((template) => template.version.desc()).first();
  }

  async findTemplateSteps(templateId: string) {
    return db.orm.public.SigningTemplateStep
      .where({ templateId })
      .orderBy((step) => step.sequence.asc())
      .all();
  }

  async findPendingApprovalStep(signRequestId: string, sequence: number) {
    return db.orm.public.SignRequestApproval
      .where({
        signRequestId,
        sequence,
      })
      .first();
  }

  async findSignerCredential(userId: string) {
    return db.orm.public.SignerCredential
      .where({ userId })
      .first();
  }

  async incrementFailedAttempt(userId: string, failedAttempt: number, lockedUntil: InstantLike | null) {
    return db.orm.public.SignerCredential
      .where({ userId })
      .update({
        failedAttempt,
        lockedUntil,
      });
  }

  async logAudit(data: any) {
    return db.orm.public.AuditLog.create(data);
  }

  async executeCreateTransaction(
    input: any,
    template: any,
    steps: any[],
    actorUserId: string
  ) {
    return db.transaction(async (tx) => {
      const signRequest = await tx.orm.public.SignRequest.create({
        templateId: template.id,
        referenceId: input.referenceId,
        villageId: input.villageId ?? null,
        banjarId: input.banjarId ?? null,
        status: "IN_PROGRESS",
        currentSequence: steps[0]!.sequence,
        completedAt: null,
        cancelledAt: null,
      });

      const approvals = [];

      for (const step of steps) {
        const approval = await tx.orm.public.SignRequestApproval.create({
          signRequestId: signRequest.id,
          level: step.level,
          role: step.role,
          permission: step.permission,
          sequence: step.sequence,
          required: step.required,
          status: "PENDING",
          signerUserId: null,
          letterNumber: null,
          letterDate: null,
          page: step.page,
          x: step.x,
          y: step.y,
          width: step.width,
          height: step.height,
          approvedAt: null,
          rejectedAt: null,
          rejectionReason: null,
        });

        approvals.push(approval);
      }

      await tx.orm.public.AuditLog.create({
        signRequestId: signRequest.id,
        actorUserId,
        action: "SIGN_REQUEST_CREATED",
        ipAddress: null,
        userAgent: null,
        metadata: {
          templateCode: input.templateCode,
          templateVersion: template.version,
          referenceId: input.referenceId,
        },
      });

      await tx.orm.public.AuditLog.create({
        signRequestId: signRequest.id,
        actorUserId: null,
        action: "APPROVAL_STARTED",
        ipAddress: null,
        userAgent: null,
        metadata: {
          sequence: steps[0]!.sequence,
          level: steps[0]!.level,
          role: steps[0]!.role,
        },
      });

      return {
        signRequest,
        approvals,
      };
    });
  }

  async findNextPendingApprovals(signRequestId: string, currentSequence: number) {
    return db.orm.public.SignRequestApproval
      .where({ signRequestId })
      .where((approval) => approval.sequence.gt(currentSequence))
      .where({ status: "PENDING" })
      .orderBy((approval) => approval.sequence.asc())
      .all();
  }

  async executeApproveTransaction(
    signRequestId: string,
    approvalId: string,
    userId: string,
    input: any,
    nextApproval: any | null,
    nextStatus: any,
    currentSequence: number
  ) {
    return db.transaction(async (tx) => {
      await tx.orm.public.SignerCredential
        .where({ userId })
        .update({
          failedAttempt: 0,
          lockedUntil: null,
        });

      const updatedApproval = await tx.orm.public.SignRequestApproval
        .where({ id: approvalId })
        .update({
          status: "APPROVED",
          signerUserId: userId,
          letterNumber: input.letterNumber ?? null,
          letterDate: input.letterDate ? toInstant(input.letterDate) : null,
          approvedAt: nowInstant(),
          rejectedAt: null,
          rejectionReason: null,
        });

      const updatedSignRequest = await tx.orm.public.SignRequest
        .where({ id: signRequestId })
        .update({
          status: nextStatus,
          currentSequence: nextApproval?.sequence ?? currentSequence,
        });

      await tx.orm.public.AuditLog.create({
        signRequestId,
        actorUserId: userId,
        action: "PIN_VERIFICATION_SUCCESS",
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        metadata: {
          sequence: updatedApproval!.sequence,
          level: updatedApproval!.level,
        },
      });

      await tx.orm.public.AuditLog.create({
        signRequestId,
        actorUserId: userId,
        action: "APPROVAL_APPROVED",
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        metadata: {
          sequence: updatedApproval!.sequence,
          level: updatedApproval!.level,
          letterNumber: input.letterNumber ?? null,
        },
      });

      if (nextApproval) {
        await tx.orm.public.AuditLog.create({
          signRequestId,
          actorUserId: null,
          action: "APPROVAL_STARTED",
          ipAddress: input.ipAddress ?? null,
          userAgent: input.userAgent ?? null,
          metadata: {
            sequence: nextApproval.sequence,
            level: nextApproval.level,
            role: nextApproval.role,
          },
        });
      }

      return {
        signRequest: updatedSignRequest,
        approval: updatedApproval,
        nextApproval,
      };
    });
  }

  async findApprovedApprovals(signRequestId: string) {
    return db.orm.public.SignRequestApproval
      .where({ signRequestId })
      .where({ status: "APPROVED" })
      .orderBy((approval) => approval.sequence.asc())
      .all();
  }

  async findPendingRequiredApproval(signRequestId: string) {
    return db.orm.public.SignRequestApproval
      .where({
        signRequestId,
        required: true,
        status: "PENDING",
      })
      .first();
  }

  async executeFinalSignTransaction(
    signRequest: any,
    approvals: any[],
    input: any,
    signatureValues: { approvalId: string, value: string }[]
  ) {
    return db.transaction(async (tx) => {
      await tx.orm.public.SignRequest
        .where({ id: signRequest.id })
        .update({ status: "PROCESSING" });

      await tx.orm.public.AuditLog.create({
        signRequestId: signRequest.id,
        actorUserId: input.userId,
        action: "DOCUMENT_RECEIVED",
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        metadata: {
          fileKey: input.fileKey,
          documentHash: input.documentHash,
        },
      });

      await tx.orm.public.AuditLog.create({
        signRequestId: signRequest.id,
        actorUserId: input.userId,
        action: "SIGNING_STARTED",
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        metadata: {
          approvalCount: approvals.length,
        },
      });

      const document = await tx.orm.public.Document.create({
        signRequestId: signRequest.id,
        type: "FINAL",
        fileKey: input.fileKey,
        hash: input.documentHash,
        mimeType: input.mimeType ?? "application/pdf",
        fileSize: input.fileSize ?? null,
        locked: true,
      });

      const signatures = [];

      for (const approval of approvals) {
        const signatureValObj = signatureValues.find(sv => sv.approvalId === approval.id);
        if (!signatureValObj) continue;

        const signature = await tx.orm.public.Signature.create({
          signRequestId: signRequest.id,
          approvalId: approval.id,
          documentId: document.id,
          signerUserId: approval.signerUserId!,
          level: approval.level,
          documentHash: input.documentHash,
          algorithm: "HMAC-SHA256",
          signatureValue: signatureValObj.value,
          certificateSerial: input.certificateSerial ?? null,
          certificateIssuer: input.certificateIssuer ?? null,
        });

        signatures.push(signature);
      }

      await tx.orm.public.AuditLog.create({
        signRequestId: signRequest.id,
        actorUserId: input.userId,
        action: "DOCUMENT_HASHED",
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        metadata: {
          documentId: document.id,
          documentHash: input.documentHash,
        },
      });

      await tx.orm.public.AuditLog.create({
        signRequestId: signRequest.id,
        actorUserId: input.userId,
        action: "SIGNING_COMPLETED",
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        metadata: {
          documentId: document.id,
          signatureCount: signatures.length,
        },
      });

      const completedRequest = await tx.orm.public.SignRequest
        .where({ id: signRequest.id })
        .update({
          status: "SIGNED",
          completedAt: nowInstant(),
        });

      await tx.orm.public.AuditLog.create({
        signRequestId: signRequest.id,
        actorUserId: input.userId,
        action: "SIGN_REQUEST_COMPLETED",
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        metadata: {
          documentId: document.id,
        },
      });

      return {
        signRequest: completedRequest,
        document,
        signatures,
      };
    });
  }
}

export const approvalProcessRepository = new ApprovalProcessRepository();
