import { getMovieInfo, getMovies, likeMovie } from '../controllers/movies'
import { getMovieComments } from '../controllers/comments'
import express, { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { createValidator } from 'express-joi-validation'
import Joi from 'joi'
import verifyToken from '../middleware/auth.middleware'

const router: Router = express.Router()

const validator = createValidator()

const movieSchema = Joi.object({
    genre: Joi.string(),
	downloaded: Joi.string(),
    minGrade: Joi.number(),
	year: Joi.number(),
	language: Joi.string(),
    sortBy: Joi.string(),
	search: Joi.string(),
	limit: Joi.number().required(),
	offset: Joi.number().required(),
})

const imdbIdSchema = Joi.object({
	movieId: Joi.string()
})

const myImdbSchema = Joi.object({
	movieId: Joi.string().regex(/tt/, 'imdbCode').required(),
})

router.get('/', verifyToken, validator.query(movieSchema), asyncHandler(getMovies))

router.get('/:movieId', verifyToken, validator.params(imdbIdSchema), asyncHandler(getMovieInfo))

router.get('/like/:movieId', verifyToken, validator.params(imdbIdSchema), asyncHandler(likeMovie))

router.get('/:movieId/comments', verifyToken, validator.params(myImdbSchema), asyncHandler(getMovieComments))

export default router
