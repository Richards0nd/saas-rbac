import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { organizationSchema } from '@saas/auth'

export async function shutdownOrganization(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.delete(
			'/organizations/:slug',
			{
				schema: {
					tags: ['Organizations'],
					summary: 'Shutdown organization',
					security: [{ bearerAuth: [] }],
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

				const authOrg = organizationSchema.parse({
					organization
				})

				const { cannot } = getUserPermissions(userId, membership.role)

				if (cannot('delete', authOrg))
					throw new UnauthorizedError(
						'You are not allowed to shutdown this organization'
					)

				await prisma.organization.delete({
					where: {
						id: organization.id
					}
				})

				return res.status(204).send({
					message: 'Successfully, organization has been shutdown.'
				})
			}
		)
}
