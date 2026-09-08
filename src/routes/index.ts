import Elysia from "elysia";
import { successResponse } from "../commons/response";
import { authMiddleware } from "../commons/middleware/auth.middleware";
import { signerPinHandler } from "../modules/signer-pin/handler/signer-pin.handler";
import { signatureProfileHandler } from "../modules/signature/handler/signature-profile.handler";
import { signRequestHandler } from "../modules/sign-request/handler/sign-request.handler";

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
    .use(signerPinHandler)
    .use(signatureProfileHandler)
    .use(signRequestHandler);