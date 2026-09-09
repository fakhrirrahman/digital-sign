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
}

export const signerSetupService = new SignerSetupService();
