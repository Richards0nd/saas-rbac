import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { BadRequestError } from './routes/_errors/bad-request-error'
import { UnauthorizedError } from './routes/_errors/unauthorized-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, _, res) => {
	if (error instanceof ZodError) {
		return res.status(400).send({
			message: 'Validation Error',
			errors: error.flatten().fieldErrors
		})
	}

	if (error instanceof BadRequestError) {
		return res.status(400).send({
			message: error.message
		})
	}

	if (error instanceof UnauthorizedError) {
		return res.status(401).send({
			message: error.message
		})
	}

	console.error(error)
	// send error to some observability service
	return res.status(500).send({
		message: 'Internal Server Error'
	})
}
