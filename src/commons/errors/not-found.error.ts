import { AppError } from './app.error'

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(
      404,
      message,
      'NOT_FOUND'
    )
  }
}