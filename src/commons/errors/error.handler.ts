import { Elysia } from 'elysia'
import { AppError } from './app.error'

export const errorHandler = new Elysia({
  name: 'error-handler'
})
  .onError(({ error, code, set }) => {
    if (error instanceof AppError) {
      set.status = error.statusCode

      return {
        success: false,
        error: {
          code: error.code,
          message: error.message
        }
      }
    }

    if (code === 'VALIDATION') {
      set.status = 422

      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data'
        }
      }
    }

    console.error(error)

    set.status = 500

    return {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error'
      }
    }
  })