import { Request, Response } from 'express'
import { NotConnected, SuccessMsg } from '../shared/msg-error'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { TUserCookie } from '../types_backend/user-cookie';

export async function getMe(req: Request, res: Response) {
	try {
		const decoded: TUserCookie = await getUserFromRequest(req);
		res.status(200).send({ msg: SuccessMsg, deco: decoded })
	}
	catch (error) {
		res.status(401).send(NotConnected)
	}
}

export async function getUserFromRequest(req: Request): Promise<TUserCookie> {
	try {
		const token = req.cookies.token
		if (token) {
			const decoded = await jwt.verify(token, process.env.TOKEN_KEY) as JwtPayload;
			if (!decoded)
				throw new Error(NotConnected)
			const decodedCookie: TUserCookie = {
				user_id: decoded.user_id,
				username: decoded.username,
				email: decoded.email,
			}
			return decodedCookie
		}
		else
			throw new Error(NotConnected)
	}
	catch (error) {
		throw new Error(NotConnected)
	}
}
