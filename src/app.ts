import { Elysia } from "elysia";
import { routes } from "./routes";
import { errorHandler } from "./commons/errors/error.handler";
import { requestLoggerMiddleware } from "./commons/middleware/request-logger.middleware";

export const app = new Elysia()
  .use(errorHandler)
  .use(requestLoggerMiddleware)
  .use(routes);
