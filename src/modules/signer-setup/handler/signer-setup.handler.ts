import Elysia from "elysia";
import { successResponse } from "../../../commons/response";
import { getAuthUserId } from "../../../commons/utils/auth";
import { SignerSetupModel } from "../model/signer-setup.model";
import { signerSetupService } from "../service/signer-setup.service";

export const signerSetupHandler = new Elysia({
  prefix: "/signer-setup",
})
  .post(
    "/pin",
    async (context) => {
      const userId = getAuthUserId((context as any).auth);
      const { body } = context;
      const credential = await signerSetupService.setupPin(userId, body.pin);

      return successResponse({
        credential,
      }, "Signer PIN has been configured");
    },
    {
      body: SignerSetupModel.setupPinBody,
    },
  )
  .post(
    "/profile",
    async (context) => {
      const userId = getAuthUserId((context as any).auth);
      const { body } = context;
      const profile = await signerSetupService.upsertProfile(
        userId,
        body.signatureImageKey,
      );

      return successResponse({
        profile,
      }, "Signature profile has been configured");
    },
    {
      body: SignerSetupModel.upsertProfileBody,
    },
  );
