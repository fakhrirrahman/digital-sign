import { Elysia } from 'elysia'
import { logger } from '../utils/logger'

export const requestLoggerMiddleware = new Elysia()
  .derive(() => ({
    requestStartedAt: performance.now()
  }))

  .onRequest(({ request }) => {
    const url = new URL(request.url)

    logger.info(
      {
        method: request.method,
        path: url.pathname
      },
      'Request started'
    )
  })

  .onAfterResponse(({ request, set, requestStartedAt }) => {
    const url = new URL(request.url)

    const duration = Math.round(
      performance.now() - requestStartedAt
    )

    logger.info(
      {
        method: request.method,
        path: url.pathname,
        status: set.status ?? 200,
        durationMs: duration
      },
      'Request completed'
    )
  })