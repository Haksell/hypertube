import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { CustomError } from '../types_backend/movies';

const prisma = new PrismaClient()

export async function getUsers(req: Request, res: Response) {
	try {
		let users = await prisma.user.findMany({
			take: 50,
			select: {
				id: true,
				username: true,
			}
		})
		if (!users) {
			res.status(200).json({});
			return
		}
		res.status(200).json(users);
	}
	catch (error) {
		if (error instanceof CustomError) res.status(400).send(`Invalid request: ${error.message}`)
        else res.status(400).send('Error with request')
	}
}

export async function getOneUser(req: Request, res: Response) {
	try {
		let users = await prisma.user.findMany({
			take: 50,
			select: {
				id: true,
				username: true,
			}
		})
		if (!users) {
			res.status(200).json({});
			return
		}
		res.status(200).json(users);
	}
	catch (error) {
		if (error instanceof CustomError) res.status(400).send(`Invalid request: ${error.message}`)
        else res.status(400).send('Error with request')
	}
}
