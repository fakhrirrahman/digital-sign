import Elysia from "elysia";
import { successResponse } from "../../../commons/response";
import { getAuthUserId } from "../../../commons/utils/auth";
import { SignerSetupModel } from "../model/signer-setup.model";
import { signerSetupService } from "../service/signer-setup.service";
import { jwtPlugin } from "../../../commons/plugins/jwt.plugin";
import { UnauthorizedError } from "../../../commons/errors/unauthorized.error";

export const signerSetupHandler = new Elysia({
  prefix: "/signer-setup",
})
  .use(jwtPlugin)
  .get(
    "/status",
    async ({ headers, jwt }) => {
      const authorization = headers.authorization;
      if (!authorization) throw new UnauthorizedError("Authorization header is missing");
      const token = authorization.slice(7);
      const auth = await jwt.verify(token);
      if (!auth) throw new UnauthorizedError("Invalid or expired token");
      
      const userId = getAuthUserId(auth);
      const status = await signerSetupService.getStatus(userId);
      return successResponse(status);
    }
  )
  .post(
    "/pin",
    async ({ headers, jwt, body }) => {
      const authorization = headers.authorization;
      if (!authorization) throw new UnauthorizedError("Authorization header is missing");
      const token = authorization.slice(7);
      const auth = await jwt.verify(token);
      if (!auth) throw new UnauthorizedError("Invalid or expired token");

      const userId = getAuthUserId(auth);
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
    async ({ headers, jwt, body }) => {
      const authorization = headers.authorization;
      if (!authorization) throw new UnauthorizedError("Authorization header is missing");
      const token = authorization.slice(7);
      const auth = await jwt.verify(token);
      if (!auth) throw new UnauthorizedError("Invalid or expired token");

      const userId = getAuthUserId(auth);
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
