import { auth } from '@/http/middlewares/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function getOrganization(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			'/organizations/:slug',
			{
				schema: {
					tags: ['Organizations'],
					summary: 'Get organization',
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string()
					}),
					response: {
						201: z.object({
							organization: z.object({
								id: z.string(),
								name: z.string(),
								slug: z.string(),
								domain: z.string().nullable(),
								shouldAttachUsersByDomain: z.boolean(),
								avatarUrl: z.string().url().nullable(),
								ownerId: z.string().uuid(),
								createdAt: z.date(),
								updatedAt: z.date()
							})
						})
					}
				}
			},
			async (req, res) => {
				const { slug } = req.params
				const { organization } = await req.getUserMemberShop(slug)

				return res.send({ organization })
			}
		)
}
