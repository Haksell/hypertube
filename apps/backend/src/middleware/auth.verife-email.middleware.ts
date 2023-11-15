import { Request, Response } from 'express';
import { isEmail } from '../utils/check-email';
import { InvalidEmail, MissingEmail } from '../shared/msg-error';

export function validateForgotPwdBody(req: Request, res: Response, next: any) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json(MissingEmail);
    }

    if (!isEmail(email)) {
        return res.status(400).json(InvalidEmail);
    }

    next();
}