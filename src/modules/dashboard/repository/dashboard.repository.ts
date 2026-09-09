import { db } from "../../../prisma/db";

export class DashboardRepository {
  async getPendingRequestsCount() {
    const result = await db.orm.public.SignRequest
      .where((req) => req.status.in(["PENDING", "IN_PROGRESS", "READY_TO_SIGN"]))
      .aggregate((aggregate) => ({
        total: aggregate.count(),
      }));

    return result.total;
  }

  async getSignedRequestsCount() {
    const result = await db.orm.public.SignRequest
      .where({ status: "SIGNED" })
      .aggregate((aggregate) => ({
        total: aggregate.count(),
      }));

    return result.total;
  }

  async getSignedRequestsThisYear() {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    
    return db.orm.public.SignRequest
      .select("completedAt")
      .where({ status: "SIGNED" })
      .where((req) => req.completedAt.gte(startOfYear))
      .all();
  }

  async getAverageSigningTimeInMinutes() {
    // Basic implementation: fetch signed requests, calculate difference
    const signedRequests = await db.orm.public.SignRequest
      .select("createdAt", "completedAt")
      .where({ status: "SIGNED" })
      .where((req) => req.completedAt.isNotNull())
      .all();

    if (signedRequests.length === 0) return 0;

    let totalDiffMs = 0;
    let count = 0;
    for (const req of signedRequests) {
      if (req.completedAt && req.createdAt) {
        totalDiffMs += req.completedAt.getTime() - req.createdAt.getTime();
        count++;
      }
    }

    if (count === 0) return 0;
    return Math.round((totalDiffMs / count) / (1000 * 60));
  }
}

export const dashboardRepository = new DashboardRepository();
