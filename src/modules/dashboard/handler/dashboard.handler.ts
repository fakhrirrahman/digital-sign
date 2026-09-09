import Elysia from "elysia";
import { successResponse } from "../../../commons/response";
import { dashboardService } from "../service/dashboard.service";
import { authMiddleware } from "../../../commons/middleware/auth.middleware";
import { DashboardModel } from "../model/dashboard.model";

export const dashboardHandler = new Elysia({
  prefix: "/dashboard",
})
  .use(authMiddleware)
  .get(
    "/stats", 
    async () => {
      const stats = await dashboardService.getStats();
      return successResponse(stats);
    },
    {
      response: {
        200: DashboardModel.statsResponse,
      }
    }
  )
  .get(
    "/chart", 
    async () => {
      const chartData = await dashboardService.getChartData();
      return successResponse(chartData);
    },
    {
      response: {
        200: DashboardModel.chartResponse,
      }
    }
  );
