import fastifyCors from '@fastify/cors'
import { fastify } from 'fastify'
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider
} from 'fastify-type-provider-zod'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import fastifyJwt from '@fastify/jwt'
import { createAccount } from './routes/auth/create-account'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { getProfile } from './routes/auth/get-profile'
import { errorHandler } from './errorHandler'
import { requestPasswordRecovery } from './routes/auth/request-password-recovery'
import { resetPassword } from './routes/auth/reset-password'
import { authenticateWithGithub } from './routes/auth/authenticate-with-github'
import { env } from '@saas/env'
import { createOrganization } from './routes/orgs/create-organization'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'SAAS',
			description: 'Full-stack Saas app with multi-tenant & RBAC',
			version: '1.0.0'
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT'
				}
			}
		}
	},
	transform: jsonSchemaTransform
})

app.register(fastifySwaggerUI, { routePrefix: '/docs' })

app.register(fastifyJwt, { secret: env.JWT_SECRET })

app.register(fastifyCors)

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(authenticateWithGithub)

app.register(getProfile)
app.register(requestPasswordRecovery)
app.register(resetPassword)

app.register(createOrganization)

app.listen({ host: env.SERVER_HOST, port: env.SERVER_PORT }).then(() => {
	console.log(
		`Server listening on http://${env.SERVER_HOST}:${env.SERVER_PORT}`
	)
})
