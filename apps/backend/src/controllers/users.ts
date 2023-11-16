import { Request, Response } from 'express'
import { NotConnected, SuccessMsg } from '../shared/msg-error'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { TUserCookie } from '../types_backend/user-cookie';
import { PrismaClient } from '@prisma/client';
import { formatUser } from '../utils/format';

const prisma = new PrismaClient()

//code 200 to avoid many messages
export async function getMe(req: Request, res: Response) {
	try {
		const decoded: TUserCookie = await getUserFromRequest(req);
		const user = await prisma.user.findUnique({
			where: {
				username: decoded.username,
			}
		})
		if (!user)
			res.status(200).send(NotConnected)

		res.status(200).send(formatUser(user))
	}
	catch (error) {
		res.status(200).send(NotConnected)
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
