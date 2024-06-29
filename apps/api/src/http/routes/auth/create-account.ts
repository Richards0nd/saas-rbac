import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { BadRequestError } from '../_errors/bad-request-error'

export async function createAccount(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/users',
		{
			schema: {
				tags: ['Auth'],
				summary: 'Create a new account',
				body: z.object({
					name: z.string(),
					email: z.string().email(),
					password: z.string().min(8)
				})
			}
		},
		async (req, res) => {
			const { name, email, password } = req.body

			const userWithSameEmail = await prisma.user.findUnique({
				where: { email }
			})

			if (userWithSameEmail) throw new BadRequestError('Email already in use')

			const [, domain] = email.split('@')

			const autoJoinOrganization = await prisma.organization.findFirst({
				where: { domain, shouldAttachUsersByDomain: true }
			})

			const passwordHash = await hash(password, 6)

			await prisma.user.create({
				data: {
					name,
					email,
					password: passwordHash,
					memberOn: autoJoinOrganization
						? { create: { organizationId: autoJoinOrganization.id } }
						: undefined
				}
			})

			return res.status(201).send({ message: 'Account created' })
		}
	)
}
