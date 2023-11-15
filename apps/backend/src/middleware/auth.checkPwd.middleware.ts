import { Request, Response } from 'express';
import { isPassword } from '../utils/check-pwd';
import { MissingPwd, WeakPwd } from '../shared/msg-error';

export function validateResetPwdBody(req: Request, res: Response, next: any) {
    const { password } = req.body;

    if (!password) {
        return res.status(200).json(MissingPwd);
    }

    if (!isPassword(password)) {
        return res.status(200).json(WeakPwd);
    }

    next();
}