import { t } from "elysia";

export const ApprovalProcessModel = {
  referenceParams: t.Object({
    referenceId: t.String({
      minLength: 1,
    }),
  }),

  createBody: t.Object({
    templateCode: t.String({
      minLength: 1,
    }),
    referenceId: t.String({
      minLength: 1,
    }),
    villageId: t.Optional(t.String({
      minLength: 1,
    })),
    banjarId: t.Optional(t.String({
      minLength: 1,
    })),
    templateVersion: t.Optional(t.Number({
      minimum: 1,
    })),
  }),

  approveBody: t.Object({
    pin: t.String({
      minLength: 6,
      maxLength: 6,
    }),
    letterNumber: t.Optional(t.String({
      minLength: 1,
    })),
    letterDate: t.Optional(t.String({
      format: "date-time",
    })),
  }),

  finalSignBody: t.Object({
    fileKey: t.String({
      minLength: 1,
    }),
    documentHash: t.String({
      minLength: 64,
      maxLength: 64,
    }),
    mimeType: t.Optional(t.String({
      minLength: 1,
    })),
    fileSize: t.Optional(t.Number({
      minimum: 0,
    })),
    certificateSerial: t.Optional(t.String({
      minLength: 1,
    })),
    certificateIssuer: t.Optional(t.String({
      minLength: 1,
    })),
  }),
};
