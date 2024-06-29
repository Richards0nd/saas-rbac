import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'

export async function authenticateWithPassword(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/sessions/password',
		{
			schema: {
				tags: ['Auth'],
				summary: 'Authenticate with email and password',
				body: z.object({
					email: z.string().email(),
					password: z.string().min(8)
				}),
				response: {
					200: z.object({
						message: z.string(),
						token: z.string()
					})
				}
			}
		},
		async (req, res) => {
			const { email, password } = req.body

			const userFromEmail = await prisma.user.findUnique({ where: { email } })

			if (!userFromEmail) throw new BadRequestError('User not found')

			if (userFromEmail.password === null)
				throw new BadRequestError('User has no password, use social login')

			const passwordMatch = await compare(password, userFromEmail.password)

			if (!passwordMatch) {
				throw new BadRequestError('Invalid password')
			}

			const token = await res.jwtSign(
				{ sub: userFromEmail.id },
				{ sign: { expiresIn: '7d' } }
			)

			return res.status(200).send({ message: 'Authenticated', token })
		}
	)
}
