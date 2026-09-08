import Elysia from "elysia";

import { jwtPlugin } from "../plugins/jwt.plugin";
import { UnauthorizedError } from "../errors/unauthorized.error";

export const authMiddleware = new Elysia({
  name: "auth-middleware",
})
  .use(jwtPlugin)
  .derive(async ({ headers, jwt }) => {
    const authorization = headers.authorization;

    if (!authorization) {
      throw new UnauthorizedError("Authorization header is missing");
    }

    if (!authorization.startsWith("Bearer ")) {
      throw new UnauthorizedError("Invalid authorization format");
    }

    const token = authorization.slice(7);

    const payload = await jwt.verify(token);

    if (!payload) {
      throw new UnauthorizedError("Invalid or expired token");
    }

    return {
      auth: payload,
    };
  });
