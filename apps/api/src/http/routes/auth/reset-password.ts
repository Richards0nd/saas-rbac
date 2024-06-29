import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { hash } from 'bcryptjs'

export async function resetPassword(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/password/reset',
		{
			schema: {
				tags: ['Auth'],
				summary: 'Get authenticated user profile',
				body: z.object({
					code: z.string(),
					password: z.string().min(8)
				}),
				response: {
					204: z.null()
				}
			}
		},
		async (req, res) => {
			const { code, password } = req.body

			const tokenfromCode = await prisma.token.findUnique({
				where: { id: code }
			})

			if (!tokenfromCode) throw new UnauthorizedError('Invalid recovery code')

			const passwordHash = await hash(password, 10)

			await prisma.user.update({
				where: {
					id: tokenfromCode.userId
				},
				data: {
					password: passwordHash
				}
			})

			return res.status(204).send()
		}
	)
}
