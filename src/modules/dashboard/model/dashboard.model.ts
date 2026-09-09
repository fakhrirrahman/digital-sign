import { t, type TSchema } from "elysia";

const SuccessResponse = <T extends TSchema>(dataSchema: T) =>
  t.Object({
    success: t.Boolean(),
    message: t.String(),
    data: dataSchema,
  });

export const DashboardModel = {
  statsResponse: SuccessResponse(
    t.Object({
      pendingSignatures: t.Number(),
      totalSigned: t.Number(),
      integrityPercentage: t.Number(),
      avgTimeMinutes: t.Number(),
    })
  ),

  chartResponse: SuccessResponse(
    t.Array(
      t.Object({
        month: t.String(),
        Berkas: t.Number(),
      })
    )
  ),
};
