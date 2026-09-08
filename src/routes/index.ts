import Elysia from "elysia";
import { successResponse } from "../commons/response";
import { authMiddleware } from "../commons/middleware/auth.middleware";

export const routes = new Elysia({
    prefix: '/api',
})
    .get('/health', () => {
        return successResponse({
            status: 'ok',
            message: 'API is healthy',
        })
    })

    .use(authMiddleware)