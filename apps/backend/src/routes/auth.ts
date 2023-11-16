import {
    register,
    login,
    ConfirmEmail,
    ForgotPwd,
    ConfirmForgotPwd,
    ResetPwd,
} from '../controllers/auth'
import { validateConfirmIdParam } from '../middleware/atuh.confirm-id.body.middleware'
import { validateResetPwdBody } from '../middleware/auth.checkPwd.middleware'
import { validateForgotPwdBody } from '../middleware/auth.verife-email.middleware'
import { Request, Response } from 'express'
import express, { Router } from 'express'
import asyncHandler from 'express-async-handler'

const router: Router = express.Router()

router.post('/register', asyncHandler(register))
router.post('/login', asyncHandler(login))

router.get('/confirm/:confirmId', validateConfirmIdParam, (req: Request, res: Response) => {
    return ConfirmEmail(req, res)
})

router.post('/forgotpwd', validateForgotPwdBody, (req: Request, res: Response) => {
    return ForgotPwd(req, res)
})

router.get('/forgot/:confirmId', validateConfirmIdParam, (req: Request, res: Response) => {
    return ConfirmForgotPwd(req, res)
})

router.post(
    '/forgot/:confirmId',
    validateConfirmIdParam,
    validateResetPwdBody,
    (req: Request, res: Response) => {
        return ResetPwd(req, res)
    },
)

export default router
