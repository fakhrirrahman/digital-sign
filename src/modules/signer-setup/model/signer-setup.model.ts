import { t } from "elysia";

export const SignerSetupModel = {
  setupPinBody: t.Object({
    pin: t.String({
      minLength: 6,
      maxLength: 6,
    }),
  }),

  upsertProfileBody: t.Object({
    signatureImageKey: t.String({
      minLength: 1,
    }),
  }),
};
