import { InvalidId } from '../shared/msg-error'
import { isId } from '../utils/check-id'
import { Request, Response } from 'express'

export function validateConfirmIdParam(req: Request, res: Response, next: any) {
    const { confirmId } = req.params

    if (!confirmId) {
        return res.status(400).json(InvalidId)
    }

    if (!isId(confirmId)) {
        return res.status(400).json(InvalidId)
    }

    next()
}
