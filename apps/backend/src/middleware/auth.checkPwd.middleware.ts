import { MissingPwd, WeakPwd } from '../shared/msg-error'
import { isPassword } from '../utils/check-pwd'
import { Request, Response } from 'express'

export function validateResetPwdBody(req: Request, res: Response, next: any) {
    const { password } = req.body

    if (!password) {
        return res.status(200).json(MissingPwd)
    }

    if (!isPassword(password)) {
        return res.status(200).json(WeakPwd)
    }

    next()
}
