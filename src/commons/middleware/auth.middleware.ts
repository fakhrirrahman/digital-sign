import Elysia from "elysia";

import { jwtPlugin } from "../plugins/jwt.plugin";
import { UnauthorizedError } from "../errors/unauthorized.error";

export const authMiddleware = new Elysia()
  .use(jwtPlugin)
  .derive(async ({ headers, jwt }) => {
    const authorization = headers.authorization;

    console.log("[auth.middleware] Authorization Header:", authorization);

    if (!authorization) {
      throw new UnauthorizedError("Authorization header is missing");
    }

    if (!authorization.startsWith("Bearer ")) {
      throw new UnauthorizedError("Invalid authorization format");
    }

    const token = authorization.slice(7);
    const payload = await jwt.verify(token);

    console.log("[auth.middleware] JWT Verified Payload:", payload);

    if (!payload) {
      throw new UnauthorizedError("Invalid or expired token");
    }

    return {
      auth: payload,
    };
  })
  .onBeforeHandle(({ auth }) => {
    if (!auth) {
      throw new UnauthorizedError("Authenticated user is missing");
    }
  });
