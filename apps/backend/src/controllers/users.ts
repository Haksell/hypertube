import { Request, Response } from 'express'
import { NotConnected, SuccessMsg } from '../shared/msg-error'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { TUserCookie } from '../types_backend/user-cookie';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export async function getMe(req: Request, res: Response) {
	try {
		console.log('test')
		const decoded: TUserCookie = await getUserFromRequest(req);
		console.log('test')
		const user = await prisma.user.findUnique({
			where: {
				username: decoded.username,
			}
		})
		console.log('test')
		if (!user)
			res.status(401).send(NotConnected)

		res.status(200).send({ msg: SuccessMsg, deco: user })
	}
	catch (error) {
		res.status(401).send(NotConnected)
	}
}

export async function getUserFromRequest(req: Request): Promise<TUserCookie> {
	try {
		const token = req.cookies.token
		if (token) {
			console.log('test1')
			const decoded = await jwt.verify(token, process.env.TOKEN_KEY) as JwtPayload;
			console.log('test2')
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
