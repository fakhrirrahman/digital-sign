export const errorResponse = (
  code: string,
  message: string,
  details?: unknown
) => {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined && {
        details
      })
    }
  }
}