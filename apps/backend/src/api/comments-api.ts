import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { CustomError, NotFoundError } from '../types_backend/movies';

const prisma = new PrismaClient()

type TCommentsObj = {
	id: number
	author_username: string
	date: Date
	content: string
}
export async function apiGetComments(req: Request, res: Response) {
	try {
		let comments = await prisma.comment.findMany({
			take: 30,
			include: {
				user: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
		if (!comments) {
			res.status(200).json({});
			return
		}
		const commentsObj: TCommentsObj[] = []
		for (const elem of comments) {
			const newComment: TCommentsObj = {
				id: elem.id,
				author_username: elem.user.username,
				date: elem.createdAt,
				content: elem.text
			}
			commentsObj.push(newComment)
		}
		res.status(200).json(commentsObj);
	}
	catch (error) {
		if (error instanceof CustomError) res.status(400).send(`Invalid request: ${error.message}`)
        else res.status(400).send('Error with request')
	}
}

export async function apiGetOneComment(req: Request, res: Response) {
	try {
		let comments = await prisma.comment.findMany({
			take: 30,
			include: {
				user: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
		if (!comments) {
			res.status(200).json({});
			return
		}
		const commentsObj: TCommentsObj[] = []
		for (const elem of comments) {
			const newComment: TCommentsObj = {
				id: elem.id,
				author_username: elem.user.username,
				date: elem.createdAt,
				content: elem.text
			}
			commentsObj.push(newComment)
		}
		res.status(200).json(commentsObj);
	}
	catch (error) {
		if (error instanceof CustomError) res.status(400).send(`Invalid request: ${error.message}`)
        else res.status(400).send('Error with request')
	}
}