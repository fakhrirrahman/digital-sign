import { describe, it, expect, mock, beforeEach } from "bun:test";
import { SignerSetupService } from "../service/signer-setup.service";
import { signerSetupRepository } from "../repository/signer-setup.repository";
import { auditRepository } from "../../audit/repository/audit.repository";
import { BadRequestError } from "../../../commons/errors/bad-request.error";

mock.module("../repository/signer-setup.repository", () => {
  return {
    signerSetupRepository: {
      findCredentialByUserId: mock(),
      createCredential: mock(),
      updateCredentialPin: mock(),
      findProfileByUserId: mock(),
      createProfile: mock(),
      updateProfile: mock(),
    },
  };
});

mock.module("../../audit/repository/audit.repository", () => {
  return {
    auditRepository: {
      create: mock(),
    },
  };
});

describe("SignerSetupService", () => {
  let service: SignerSetupService;

  beforeEach(() => {
    service = new SignerSetupService();
    signerSetupRepository.findCredentialByUserId.mockClear();
    signerSetupRepository.createCredential.mockClear();
    signerSetupRepository.updateCredentialPin.mockClear();
    signerSetupRepository.findProfileByUserId.mockClear();
    signerSetupRepository.createProfile.mockClear();
    signerSetupRepository.updateProfile.mockClear();
    auditRepository.create.mockClear();
  });

  describe("setupPin", () => {
    it("should throw BadRequestError if PIN is not exactly 6 digits", async () => {
      expect(service.setupPin("user1", "12345")).rejects.toThrow(BadRequestError);
      expect(service.setupPin("user1", "1234567")).rejects.toThrow(BadRequestError);
      expect(service.setupPin("user1", "abcdef")).rejects.toThrow(BadRequestError);
    });

    it("should create new credential if user doesn't have one", async () => {
      signerSetupRepository.findCredentialByUserId.mockResolvedValue(null);
      signerSetupRepository.createCredential.mockResolvedValue({ id: "cred1" } as any);

      const result = await service.setupPin("user1", "123456");

      expect(signerSetupRepository.findCredentialByUserId).toHaveBeenCalledWith("user1");
      expect(signerSetupRepository.createCredential).toHaveBeenCalled();
      expect(signerSetupRepository.updateCredentialPin).not.toHaveBeenCalled();
      expect(result.id).toBe("cred1");
    });

    it("should update credential if user already has one", async () => {
      signerSetupRepository.findCredentialByUserId.mockResolvedValue({ id: "cred1" } as any);
      signerSetupRepository.updateCredentialPin.mockResolvedValue({ id: "cred1" } as any);

      const result = await service.setupPin("user1", "654321");

      expect(signerSetupRepository.findCredentialByUserId).toHaveBeenCalledWith("user1");
      expect(signerSetupRepository.updateCredentialPin).toHaveBeenCalled();
      expect(signerSetupRepository.createCredential).not.toHaveBeenCalled();
      expect(result.id).toBe("cred1");
    });
  });

  describe("upsertProfile", () => {
    it("should create profile if none exists", async () => {
      signerSetupRepository.findProfileByUserId.mockResolvedValue(null);
      signerSetupRepository.createProfile.mockResolvedValue({ id: "prof1" } as any);
      auditRepository.create.mockResolvedValue({} as any);

      const result = await service.upsertProfile("user1", "key123");

      expect(signerSetupRepository.findProfileByUserId).toHaveBeenCalledWith("user1");
      expect(signerSetupRepository.createProfile).toHaveBeenCalledWith("user1", "key123");
      expect(auditRepository.create).toHaveBeenCalledWith({
        actorUserId: "user1",
        action: "SIGNATURE_PROFILE_CREATED",
        metadata: { signatureImageKey: "key123" }
      });
      expect(result.id).toBe("prof1");
    });

    it("should update profile if one exists", async () => {
      signerSetupRepository.findProfileByUserId.mockResolvedValue({ id: "prof1" } as any);
      signerSetupRepository.updateProfile.mockResolvedValue({ id: "prof1" } as any);
      auditRepository.create.mockResolvedValue({} as any);

      const result = await service.upsertProfile("user1", "key123");

      expect(signerSetupRepository.findProfileByUserId).toHaveBeenCalledWith("user1");
      expect(signerSetupRepository.updateProfile).toHaveBeenCalledWith("user1", "key123");
      expect(auditRepository.create).toHaveBeenCalledWith({
        actorUserId: "user1",
        action: "SIGNATURE_PROFILE_UPDATED",
        metadata: { signatureImageKey: "key123" }
      });
      expect(result.id).toBe("prof1");
    });
  });
});
