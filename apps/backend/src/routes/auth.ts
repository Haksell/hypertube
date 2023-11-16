import express, { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { createValidator } from 'express-joi-validation'
import Joi from 'joi'
import {
    register,
    login,
	login42,
    ConfirmEmail,
    ForgotPwd,
    ConfirmForgotPwd,
    ResetPwd,
	SignOut,
} from '../controllers/auth'

import { validateConfirmIdParam } from '../middleware/atuh.confirm-id.body.middleware'
import { validateResetPwdBody } from '../middleware/auth.checkPwd.middleware'
import { validateForgotPwdBody } from '../middleware/auth.verife-email.middleware'

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
	username: Joi.string().required(),
	password: Joi.string().required(),
})

router.post('/register', validator.body(registerSchema), asyncHandler(register))
router.post('/login', validator.body(loginSchema), asyncHandler(login))
router.post('/42', asyncHandler(login42))
router.get('/signout', asyncHandler(SignOut))
router.get('/confirm/:confirmId', validateConfirmIdParam, asyncHandler(ConfirmEmail))
router.post('/forgotpwd', validateForgotPwdBody, asyncHandler(ForgotPwd))
router.get('/forgot/:confirmId', validateConfirmIdParam, asyncHandler(ConfirmForgotPwd))
router.post(
    '/forgot/:confirmId',
    validateConfirmIdParam,
    validateResetPwdBody,
    asyncHandler(ResetPwd),
)

export default router
