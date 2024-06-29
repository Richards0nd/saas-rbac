import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function seed() {
	await prisma.organization.deleteMany()
	await prisma.user.deleteMany()
	await prisma.project.deleteMany()

	const passwordHash = await hash('password', 1)
	const user = await prisma.user.create({
		data: {
			name: 'John Doe',
			email: 'jonh.doe@acme.me',
			avatarUrl: 'https://github.com/Richards0nd.png',
			password: passwordHash
		}
	})
	const anotherUser = await prisma.user.create({
		data: {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			avatarUrl: faker.image.avatarGitHub(),
			password: passwordHash
		}
	})
	const anotherUser2 = await prisma.user.create({
		data: {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			avatarUrl: faker.image.avatarGitHub(),
			password: passwordHash
		}
	})
	const anotherUser3 = await prisma.user.create({
		data: {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			avatarUrl: faker.image.avatarGitHub(),
			password: passwordHash
		}
	})

	await prisma.organization.create({
		data: {
			name: 'Acme Inc (Admin)',
			domain: 'acme.me',
			slug: 'acme-admin',
			avatarUrl: faker.image.avatarGitHub(),
			shouldAttachUsersByDomain: true,
			ownerId: user.id,
			projects: {
				createMany: {
					data: [
						{
							name: faker.lorem.words(7),
							slug: faker.lorem.words(7),
							description: faker.lorem.paragraph(10),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser.id,
								anotherUser2.id,
								anotherUser3.id
							])
						},
						{
							name: faker.lorem.words(7),
							slug: faker.lorem.words(7),
							description: faker.lorem.paragraph(10),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser.id,
								anotherUser2.id,
								anotherUser3.id
							])
						},
						{
							name: faker.lorem.words(7),
							slug: faker.lorem.words(7),
							description: faker.lorem.paragraph(10),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser.id,
								anotherUser2.id,
								anotherUser3.id
							])
						},
						{
							name: faker.lorem.words(7),
							slug: faker.lorem.words(7),
							description: faker.lorem.paragraph(10),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser.id,
								anotherUser2.id,
								anotherUser3.id
							])
						}
					]
				}
			},
			members: {
				createMany: {
					data: [
						{
							userId: user.id,
							role: 'ADMIN'
						},
						{
							userId: anotherUser.id,
							role: 'MEMBER'
						},
						{
							userId: anotherUser2.id,
							role: 'MEMBER'
						},
						{
							userId: anotherUser3.id,
							role: 'BILLING'
						}
					]
				}
			}
		}
	})

	await prisma.organization.create({
		data: {
			name: 'Acme Inc (Member)',
			slug: 'acme-member',
			avatarUrl: faker.image.avatarGitHub(),
			ownerId: user.id,
			projects: {
				createMany: {
					data: [
						{
							name: faker.lorem.words(7),
							slug: faker.lorem.words(7),
							description: faker.lorem.paragraph(10),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser.id,
								anotherUser2.id,
								anotherUser3.id
							])
						},
						{
							name: faker.lorem.words(7),
							slug: faker.lorem.words(7),
							description: faker.lorem.paragraph(10),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser.id,
								anotherUser2.id,
								anotherUser3.id
							])
						},
						{
							name: faker.lorem.words(7),
							slug: faker.lorem.words(7),
							description: faker.lorem.paragraph(10),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser.id,
								anotherUser2.id,
								anotherUser3.id
							])
						},
						{
							name: faker.lorem.words(7),
							slug: faker.lorem.words(7),
							description: faker.lorem.paragraph(10),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser.id,
								anotherUser2.id,
								anotherUser3.id
							])
						}
					]
				}
			},
			members: {
				createMany: {
					data: [
						{
							userId: user.id,
							role: 'MEMBER'
						},
						{
							userId: anotherUser.id,
							role: 'MEMBER'
						},
						{
							userId: anotherUser2.id,
							role: 'ADMIN'
						},
						{
							userId: anotherUser3.id,
							role: 'BILLING'
						}
					]
				}
			}
		}
	})

	await prisma.organization.create({
		data: {
			name: 'Acme Inc (Billing)',
			slug: 'acme-billing',
			avatarUrl: faker.image.avatarGitHub(),
			ownerId: user.id,
			projects: {
				createMany: {
					data: [
						{
							name: faker.lorem.words(7),
							slug: faker.lorem.words(7),
							description: faker.lorem.paragraph(10),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser.id,
								anotherUser2.id,
								anotherUser3.id
							])
						},
						{
							name: faker.lorem.words(7),
							slug: faker.lorem.words(7),
							description: faker.lorem.paragraph(10),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser.id,
								anotherUser2.id,
								anotherUser3.id
							])
						},
						{
							name: faker.lorem.words(7),
							slug: faker.lorem.words(7),
							description: faker.lorem.paragraph(10),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser.id,
								anotherUser2.id,
								anotherUser3.id
							])
						},
						{
							name: faker.lorem.words(7),
							slug: faker.lorem.words(7),
							description: faker.lorem.paragraph(10),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser.id,
								anotherUser2.id,
								anotherUser3.id
							])
						}
					]
				}
			},
			members: {
				createMany: {
					data: [
						{
							userId: user.id,
							role: 'BILLING'
						},
						{
							userId: anotherUser.id,
							role: 'ADMIN'
						},
						{
							userId: anotherUser2.id,
							role: 'MEMBER'
						},
						{
							userId: anotherUser3.id,
							role: 'MEMBER'
						}
					]
				}
			}
		}
	})
}

seed().then(() => {
	console.log('Seed complete')
})
