import express, { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { createValidator } from 'express-joi-validation'
import Joi from 'joi'
import { register, login } from '../controllers/auth'

const router: Router = express.Router()
const validator = createValidator()

const registerSchema = Joi.object({
	username: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
})

const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
})

router.post('/register', validator.body(registerSchema), asyncHandler(register))
router.post('/login', validator.body(loginSchema), asyncHandler(login))

export default router
