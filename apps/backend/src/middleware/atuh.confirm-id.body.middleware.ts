import { Request, Response } from 'express';
import { isId } from '../utils/check-id';
import { InvalidId } from '../shared/msg-error';

export function validateConfirmIdParam(req: Request, res: Response, next: any) {
    const { confirmId } = req.params;

    if (!confirmId) {
        return res.status(400).json(InvalidId);
    }

    if (!isId(confirmId)) {
        return res.status(400).json(InvalidId);
    }

    next();
}
