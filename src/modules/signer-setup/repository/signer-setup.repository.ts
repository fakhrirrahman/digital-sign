import { db } from "../../../prisma/db";

export class SignerSetupRepository {
  async findCredentialByUserId(userId: string) {
    return db.orm.public.SignerCredential
      .where({ userId })
      .first();
  }

  async createCredential(userId: string, pinHash: string) {
    return db.orm.public.SignerCredential.create({
      userId,
      pinHash,
      failedAttempt: 0,
      lockedUntil: null,
      active: true,
      lastPinChangedAt: new Date(),
    });
  }

  async updateCredentialPin(userId: string, pinHash: string) {
    return db.orm.public.SignerCredential
      .where({ userId })
      .update({
        pinHash,
        failedAttempt: 0,
        lockedUntil: null,
        active: true,
        lastPinChangedAt: new Date(),
      });
  }

  async findProfileByUserId(userId: string) {
    return db.orm.public.SignatureProfile
      .where({ userId })
      .first();
  }

  async createProfile(userId: string, signatureImageKey: string) {
    return db.orm.public.SignatureProfile.create({
      userId,
      signatureImageKey,
      active: true,
    });
  }

  async updateProfile(userId: string, signatureImageKey: string) {
    return db.orm.public.SignatureProfile
      .where({ userId })
      .update({
        signatureImageKey,
        active: true,
      });
  }
}

export const signerSetupRepository = new SignerSetupRepository();
