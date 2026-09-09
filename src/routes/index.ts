import Elysia from "elysia";
import { successResponse } from "../commons/response";
import { authMiddleware } from "../commons/middleware/auth.middleware";
import { signerSetupHandler } from "../modules/signer-setup/handler/signer-setup.handler";
import { approvalProcessHandler } from "../modules/approval-process/handler/approval-process.handler";
import { dashboardHandler } from "../modules/dashboard/handler/dashboard.handler";

export const routes = new Elysia({
    prefix: '/api',
})
    .get('/health', () => {
        return successResponse({
            status: 'ok',
            message: 'API is healthy',
        })
    })

    // Authenticated Routes
    .use(authMiddleware)
    .use(signerSetupHandler)
    .use(approvalProcessHandler)
    .use(dashboardHandler);