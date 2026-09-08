import Elysia, { status } from "elysia";
import { jwtPlugin } from "../plugins/jwt.plugin";

export const authMiddleware = new Elysia({
  name: "auth-middleware",
})
  .use(jwtPlugin)
  .derive(async ({ headers, jwt, status }) => {
    const authorization = headers.authorization;
    if (!authorization) {
      return status(401, {
        message: "Authorization header is missing",
      });
    }
    const token = authorization.substring(7); // Remove "Bearer " prefix
    const payload = await jwt.verify(token);
    if (!payload) {
      return status(401, {
        message: "Invalid token",
      });
    }
    return payload;
  });
