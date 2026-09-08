import { jwt } from '@elysia/jwt'
import Elysia from "elysia"
import { env } from "../config/env"

export const jwtPlugin = new Elysia({
    name: 'jwt-plugin',
})
    .use(
        jwt({
            name: 'jwt',
            secret: env.auth.jwtSecret,
        })
    )