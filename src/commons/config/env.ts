const required = (key: string): string => {
  const value = Bun.env[key]

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }

  return value
}

export const env = {
  app: {
    name: Bun.env.APP_NAME ?? 'digital-sign',
    port: Number(Bun.env.APP_PORT ?? 3000),
    environment: Bun.env.APP_ENV ?? 'development'
  },

  database: {
    url: required('DATABASE_URL')
  },

  auth: {
    baseUrl: required('AUTH_BASE_URL'),
    jwtSecret: required('JWT_SECRET')
  }
} as const