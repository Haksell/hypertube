import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { CustomError, NotFoundError } from '../types_backend/movies';

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
		const { id } = req.params
		if (!id) throw new CustomError('empty argument')
		const numID = parseInt(id)
		if (isNaN(numID)) throw new CustomError('incorrect ID format')
		let user = await prisma.user.findUnique({
			where: {
				id: numID
			},
			select: {
				username: true,
				email: true,
				profile_picture: true,
			}
		})
		if (!user) throw new NotFoundError('no user found with this ID')
		res.status(200).json(user);
	}
	catch (error) {
		if (error instanceof CustomError) res.status(400).send(`Invalid request: ${error.message}`)
		else if (error instanceof NotFoundError) res.status(404).send(`Error: ${error.message}`)
        else res.status(400).send('Error with request')
	}
}
