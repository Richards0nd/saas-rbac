import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function authenticateWithGithub(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/sessions/github',
		{
			schema: {
				tags: ['Auth'],
				summary: 'Authenticate with Github',
				body: z.object({
					code: z.string()
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
			const { code } = req.body

			const githubOAuthURL = new URL(
				'https://github.com/login/oauth/access_token'
			)

			githubOAuthURL.searchParams.set('client_id', 'Ov23ligpXsy0znZSehT9')
			githubOAuthURL.searchParams.set(
				'client_secret',
				'fcd16b686b8a4522cb93086b5af944534e25448a'
			)
			githubOAuthURL.searchParams.set(
				'redirect_uri',
				'http://localhost:3000/api/auth/callback'
			)
			githubOAuthURL.searchParams.set('code', code)

			const githubAccTokenRes = await fetch(githubOAuthURL, {
				method: 'POST',
				headers: {
					Accept: 'application/json'
				}
			})

			const githubAccTokenData = await githubAccTokenRes.json()

			const { access_token: githubAccessToken } = z
				.object({
					access_token: z.string(),
					token_type: z.literal('bearer'),
					scope: z.string()
				})
				.parse(githubAccTokenData)

			const githubUserRes = await fetch('https://api.github.com/user', {
				headers: {
					Authorization: `Bearer ${githubAccessToken}`
				}
			})

			const githubUserData = await githubUserRes.json()

			const {
				id: gitHubUserId,
				name,
				email,
				avatar_url: avatarUrl
			} = z
				.object({
					id: z.number().int().transform(String),
					avatar_url: z.string().url(),
					name: z.string().nullable(),
					email: z.string().email().nullable()
				})
				.parse(githubUserData)

			if (email === null)
				throw new BadRequestError(
					'Your Github account must have an email to authenticate'
				)

			let user = await prisma.user.findUnique({
				where: {
					email
				}
			})

			if (!user)
				user = await prisma.user.create({ data: { email, name, avatarUrl } })

			let account = await prisma.account.findUnique({
				where: {
					provider_userId: {
						provider: 'GITHUB',
						userId: user.id
					}
				}
			})

			if (!account)
				account = await prisma.account.create({
					data: {
						provider: 'GITHUB',
						providerId: gitHubUserId,
						userId: user.id
					}
				})

			const token = await res.jwtSign(
				{ sub: user.id },
				{ sign: { expiresIn: '7d' } }
			)

			return res.status(200).send({ message: 'Authenticated', token })
		}
	)
}
