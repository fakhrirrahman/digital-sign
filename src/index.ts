import { app } from './app'
import { env } from './commons/config/env'

app.listen(env.app.port)

console.log(
  `🦊 ${env.app.name} is running at ${app.server?.hostname}:${app.server?.port}`
)