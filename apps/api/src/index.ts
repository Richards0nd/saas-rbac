import { defineAbilityFor, projectSchema } from '@saas/auth'

const ability = defineAbilityFor({
	role: 'MEMBER',
	id: '163121d0-e14e-40a4-81d7-93a2a826d57b'
})
const project = projectSchema.parse({
	id: '163121d0-e14e-40a4-81d7-93a2a826d57b',
	ownerId: '163121d0-e14e-40a4-81d7-93a2a826d57b'
})

const userCanDeleteOtherUsers = ability.can('get', 'Billing')

console.log(userCanDeleteOtherUsers)
console.log(ability.can('delete', project))
