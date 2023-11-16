import {
    register,
    login,
    login42,
	loginGithub,
    ConfirmEmail,
    ForgotPwd,
    ConfirmForgotPwd,
    ResetPwd,
} from '../controllers/auth'
import express, { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { createValidator } from 'express-joi-validation'
import Joi from 'joi'

const router: Router = express.Router()
const validator = createValidator()

const passwordSchema = Joi.string()
    .required()
    .min(8)
    .max(30)
    .regex(/[a-z]/, 'lowercase')
    .regex(/[A-Z]/, 'uppercase')
    .regex(/\d/, 'number')
    .regex(/[\W_]/, 'symbol')

const registerSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: passwordSchema,
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
})

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
})

const login42Schema = Joi.object({
	code: Joi.string().required(),
})

const confirmEmailSchema = Joi.object({
    confirmId: Joi.string().required(),
})

const forgotPwdSchema = Joi.object({
    email: Joi.string().required(),
})

const resetPwdSchema = Joi.object({
    password: passwordSchema,
})

router.post('/register', validator.body(registerSchema), asyncHandler(register))
router.post('/login', validator.body(loginSchema), asyncHandler(login))
router.post('/42', validator.body(login42Schema), asyncHandler(login42))
router.post('/github', validator.body(login42Schema), asyncHandler(loginGithub))
router.get('/confirm/:confirmId', validator.query(confirmEmailSchema), asyncHandler(ConfirmEmail))
router.post('/forgotpwd', validator.body(forgotPwdSchema), asyncHandler(ForgotPwd))
router.get(
    '/forgot/:confirmId',
    validator.query(confirmEmailSchema),
    asyncHandler(ConfirmForgotPwd),
)
router.post(
    '/forgot/:confirmId',
    validator.query(confirmEmailSchema),
    validator.query(resetPwdSchema),
    asyncHandler(ResetPwd),
)

export default router
