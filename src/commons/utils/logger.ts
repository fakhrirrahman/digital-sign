import pino from "pino";
import { env } from "../config/env";

const isDevelopment = env.app.environment === "development";

export const logger = pino({
  level: env.logger.logLevel,

  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,

  base: {
    service: env.app.name,
  },
});
