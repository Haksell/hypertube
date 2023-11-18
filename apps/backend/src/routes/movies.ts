import { getMovies } from '../controllers/movies'
import express, { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { createValidator } from 'express-joi-validation'
import Joi from 'joi'

const router: Router = express.Router()

const validator = createValidator()

const movieSchema = Joi.object({
    genra: Joi.string(),
    grade: Joi.number(),
	prod: Joi.number(),
    sort: Joi.string(),
	limit: Joi.number().required(),
	offset: Joi.number().required(),
})

router.get('/', validator.query(movieSchema), asyncHandler(getMovies))

export default router
