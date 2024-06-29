import type { FastifyInstance } from 'fastify'
import { UnauthorizedError } from '../routes/_errors/unauthorized-error'
import fastifyPlugin from 'fastify-plugin'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
	app.addHook('preHandler', async (req) => {
		req.getCurrentUserId = async () => {
			try {
				const { sub } = await req.jwtVerify<{ sub: string }>()
				return sub
			} catch (error) {
				throw new UnauthorizedError('Invalid auth token')
			}
		}
	})
})
