import { BadRequestError } from "../../../commons/errors/bad-request.error";
import { signerSetupRepository } from "../repository/signer-setup.repository";
import { auditRepository } from "../../audit/repository/audit.repository";

export class SignerSetupService {
  async setupPin(userId: string, pin: string) {
    if (!/^\d{6}$/.test(pin)) {
      throw new BadRequestError("PIN must be exactly 6 digits");
    }

    const pinHash = await Bun.password.hash(pin, {
      algorithm: "argon2id",
    });

    const existing = await signerSetupRepository.findCredentialByUserId(userId);

    if (existing) {
      return signerSetupRepository.updateCredentialPin(userId, pinHash);
    }

    return signerSetupRepository.createCredential(userId, pinHash);
  }

  async upsertProfile(userId: string, signatureImageKey: string) {
    const existing = await signerSetupRepository.findProfileByUserId(userId);

    if (existing) {
      const profile = await signerSetupRepository.updateProfile(userId, signatureImageKey);

      await auditRepository.create({
        actorUserId: userId,
        action: "SIGNATURE_PROFILE_UPDATED",
        metadata: { signatureImageKey },
      });

      return profile;
    }

    const profile = await signerSetupRepository.createProfile(userId, signatureImageKey);

    await auditRepository.create({
      actorUserId: userId,
      action: "SIGNATURE_PROFILE_CREATED",
      metadata: { signatureImageKey },
    });

    return profile;
  }

  async getStatus(userId: string) {
    const credential = await signerSetupRepository.findCredentialByUserId(userId);
    const profile = await signerSetupRepository.findProfileByUserId(userId);

    return {
      hasPin: !!credential,
      isLocked: credential?.lockedUntil ? new Date(credential.lockedUntil) > new Date() : false,
      failedAttempts: credential?.failedAttempt ?? 0,
      hasSignatureProfile: !!profile,
      // For mock purposes related to the frontend
      certificateId: "BSRE-2023-8874-KDS",
      keyExpiryDays: 912,
      lastSessionMinutes: 12,
      isHsmSynced: true,
      hsmSyncTime: "0.18s"
    };
  }
}

export const signerSetupService = new SignerSetupService();
