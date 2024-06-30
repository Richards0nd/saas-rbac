import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function updateteOrganization(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post(
			'/organizations/:slug',
			{
				schema: {
					tags: ['Organizations'],
					summary: 'Update a new organization',
					security: [{ bearerAuth: [] }],
					body: z.object({
						name: z.string(),
						domain: z.string().nullish(),
						shouldAttachUsersByDomain: z.boolean().optional()
					}),
					params: z.object({
						slug: z.string()
					}),
					response: {
						201: z.object({
							message: z.string()
						})
					}
				}
			},
			async (req, res) => {
				const { slug } = req.params
				const userId = await req.getCurrentUserId()
				const { membership, organization } = await req.getUserMemberShop(slug)
				const { name, domain, shouldAttachUsersByDomain } = req.body

				const authOrg = organizationSchema.parse({
					organization
				})

				const { cannot } = getUserPermissions(userId, membership.role)

				if (cannot('update', authOrg))
					throw new UnauthorizedError(
						'You are not allowed to update this organization'
					)

				if (domain) {
					const organizationByDomain = await prisma.organization.findFirst({
						where: {
							domain,
							id: { not: organization.id }
						}
					})

					if (organizationByDomain)
						throw new BadRequestError(
							'Organization with this domain already exists'
						)
				}

				await prisma.organization.update({
					where: {
						id: organization.id
					},
					data: {
						name,
						domain,
						shouldAttachUsersByDomain
					}
				})

				return res.status(204).send({
					message: 'Organization updated successfully'
				})
			}
		)
}
