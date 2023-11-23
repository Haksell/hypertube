import {
    getComments,
    getComment,
    updateComment,
    deleteComment,
    createComment,
} from '../controllers/comments'
import verifyToken from '../middleware/auth.middleware'
import express, { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { createValidator } from 'express-joi-validation'
import Joi from 'joi'

const router: Router = express.Router()

const validator = createValidator()

const updateCommentSchema = Joi.object({
    comment: Joi.string().required()
})

const createCommentSchema = Joi.object({
    comment: Joi.string().required(),
	movieId: Joi.number().required(),
})

const commentIdSchema = Joi.object({
	commentId: Joi.number().required(),
})

router.get('/', verifyToken, asyncHandler(getComments))
router.get('/:commentId', verifyToken, validator.params(commentIdSchema), asyncHandler(getComment))
router.patch('/:commentId', verifyToken, validator.params(commentIdSchema), validator.body(updateCommentSchema), asyncHandler(updateComment))
router.delete('/:commentId', verifyToken, validator.params(commentIdSchema), asyncHandler(deleteComment))
router.post('/', verifyToken, validator.body(createCommentSchema), asyncHandler(createComment))

export default router