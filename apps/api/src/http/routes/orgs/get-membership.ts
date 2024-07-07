import { auth } from '@/http/middlewares/auth'
import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function getMembership(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			'/organizations/:slug/membership',
			{
				schema: {
					tags: ['Organizations'],
					summary: 'Get membership on organization',
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string()
					}),
					response: {
						200: z.object({
							membership: z.object({
								id: z.string(),
								role: roleSchema,
								organizationId: z.string().uuid()
							})
						})
					}
				}
			},
			async (req, res) => {
				const { slug } = req.params
				const { membership } = await req.getUserMemberShop(slug)

				return res.send({
					membership: {
						id: membership.id,
						role: membership.role,
						organizationId: membership.organizationId
					}
				})
			}
		)
}
