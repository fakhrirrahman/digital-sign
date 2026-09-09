import { dashboardRepository } from "../repository/dashboard.repository";
import { instantToEpochMilliseconds } from "../../../commons/utils/temporal";

export class DashboardService {
  async getStats() {
    const pendingCount = await dashboardRepository.getPendingRequestsCount();
    const signedCount = await dashboardRepository.getSignedRequestsCount();
    const avgTime = await dashboardRepository.getAverageSigningTimeInMinutes();

    // Mocking integrity stat for now as it requires complex PKI verification logic
    // In real app, this might come from a background job verifying signatures
    return {
      pendingSignatures: Number(pendingCount),
      totalSigned: Number(signedCount),
      integrityPercentage: 99.4, 
      avgTimeMinutes: Number(avgTime),
    };
  }

  async getChartData() {
    const signedThisYear = await dashboardRepository.getSignedRequestsThisYear();
    
    // Initialize months 0-11
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const monthlyData = months.map(month => ({ month, Berkas: 0 }));

    // Group by month
    for (const req of signedThisYear) {
      if (req.completedAt) {
        const monthIndex = new Date(instantToEpochMilliseconds(req.completedAt)).getMonth();
        monthlyData[monthIndex].Berkas++;
      }
    }

    return monthlyData;
  }
}

export const dashboardService = new DashboardService();
