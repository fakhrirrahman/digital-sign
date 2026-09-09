import { describe, it, expect, mock, beforeEach } from "bun:test";
import { ApprovalProcessService } from "../service/approval-process.service";
import { approvalProcessRepository } from "../repository/approval-process.repository";
import { ConflictError } from "../../../commons/errors/conflict.error";
import { NotFoundError } from "../../../commons/errors/not-found.error";

mock.module("../repository/approval-process.repository", () => {
  return {
    approvalProcessRepository: {
      findAll: mock(),
      findByReferenceId: mock(),
      findActiveTemplate: mock(),
      findTemplateSteps: mock(),
      executeCreateTransaction: mock(),
      findPendingApprovalStep: mock(),
      findSignerCredential: mock(),
      incrementFailedAttempt: mock(),
      logAudit: mock(),
      findNextPendingApprovals: mock(),
      executeApproveTransaction: mock(),
      findApprovedApprovals: mock(),
      findPendingRequiredApproval: mock(),
      executeFinalSignTransaction: mock(),
    },
  };
});

describe("ApprovalProcessService", () => {
  let service: ApprovalProcessService;

  beforeEach(() => {
    service = new ApprovalProcessService();
    approvalProcessRepository.findAll.mockClear();
    approvalProcessRepository.findByReferenceId.mockClear();
    approvalProcessRepository.findActiveTemplate.mockClear();
    approvalProcessRepository.findTemplateSteps.mockClear();
    approvalProcessRepository.executeCreateTransaction.mockClear();
    approvalProcessRepository.findPendingApprovalStep.mockClear();
    approvalProcessRepository.findSignerCredential.mockClear();
    approvalProcessRepository.incrementFailedAttempt.mockClear();
    approvalProcessRepository.logAudit.mockClear();
    approvalProcessRepository.findNextPendingApprovals.mockClear();
    approvalProcessRepository.executeApproveTransaction.mockClear();
    approvalProcessRepository.findApprovedApprovals.mockClear();
    approvalProcessRepository.findPendingRequiredApproval.mockClear();
    approvalProcessRepository.executeFinalSignTransaction.mockClear();
  });

  describe("create", () => {
    it("should throw ConflictError if referenceId already exists", async () => {
      approvalProcessRepository.findByReferenceId.mockResolvedValue({ id: "req1" } as any);

      await expect(service.create({
        templateCode: "TPL1",
        referenceId: "REF1"
      }, "user1")).rejects.toThrow(ConflictError);
    });

    it("should throw NotFoundError if template is not found", async () => {
      approvalProcessRepository.findByReferenceId.mockResolvedValue(null);
      approvalProcessRepository.findActiveTemplate.mockResolvedValue(null);

      await expect(service.create({
        templateCode: "TPL1",
        referenceId: "REF1"
      }, "user1")).rejects.toThrow(NotFoundError);
    });

    it("should call executeCreateTransaction when successful", async () => {
      approvalProcessRepository.findByReferenceId.mockResolvedValue(null);
      approvalProcessRepository.findActiveTemplate.mockResolvedValue({ id: "tpl1", version: 1 } as any);
      approvalProcessRepository.findTemplateSteps.mockResolvedValue([{ id: "step1", sequence: 1 }] as any);
      approvalProcessRepository.executeCreateTransaction.mockResolvedValue({ signRequest: { id: "req1" } } as any);

      const result = await service.create({
        templateCode: "TPL1",
        referenceId: "REF1"
      }, "user1");

      expect(approvalProcessRepository.executeCreateTransaction).toHaveBeenCalled();
      expect(result.signRequest.id).toBe("req1");
    });
  });

  describe("finalSign", () => {
    it("should throw NotFoundError if request not found", async () => {
      approvalProcessRepository.findByReferenceId.mockResolvedValue(null);

      await expect(service.finalSign({
        referenceId: "REF1",
        userId: "user1",
        fileKey: "key1",
        documentHash: "hash1"
      })).rejects.toThrow(NotFoundError);
    });

    it("should throw ConflictError if status is not ready to sign", async () => {
      approvalProcessRepository.findByReferenceId.mockResolvedValue({ id: "req1", status: "PENDING" } as any);

      await expect(service.finalSign({
        referenceId: "REF1",
        userId: "user1",
        fileKey: "key1",
        documentHash: "hash1"
      })).rejects.toThrow(ConflictError);
    });
  });
});
