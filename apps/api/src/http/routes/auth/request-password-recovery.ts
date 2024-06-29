import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function requestPasswordRecovery(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/password/recovery',
		{
			schema: {
				tags: ['Auth'],
				summary: 'Get authenticated user profile',
				body: z.object({
					email: z.string().email()
				}),
				response: {
					200: z.null()
				}
			}
		},
		async (req, res) => {
			const { email } = req.body

			const userFromEmail = await prisma.user.findUnique({
				where: { email }
			})

			if (!userFromEmail) return res.status(200).send()

			const { id: code } = await prisma.token.create({
				data: {
					type: 'PASSWORD_RECOVER',
					userId: userFromEmail.id
				}
			})

			// send e-mail with password recovery link
			console.log('Recovery code:', code)

			return res.status(200).send()
		}
	)
}
