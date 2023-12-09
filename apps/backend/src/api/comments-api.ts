import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { CustomError, NotFoundError } from '../types_backend/movies';
import { SuccessMsg } from '../shared/msg-error';

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
		const { id } = req.params
		if (!id) throw new CustomError('empty argument')
		const numID = parseInt(id)
		if (isNaN(numID)) throw new CustomError('incorrect ID format')

		let comment = await prisma.comment.findUnique({
			where: {
				id: numID,
			},
			include: {
				user: true,
				movie: true
			}
		})
		if (!comment) throw new NotFoundError('Comment not found')
		const commentsObj: TCommentsObj = {
			id: comment.id,
			author_username: comment.user.username,
			date: comment.createdAt,
			content: comment.text
		}
		res.status(200).json(commentsObj);
	}
	catch (error) {
		if (error instanceof CustomError) res.status(400).send(`Invalid request: ${error.message}`)
		else if (error instanceof NotFoundError) res.status(404).send(`Error: ${error.message}`)
        else res.status(400).send('Error with request')
	}
}

export async function apiPatchComment(req: Request, res: Response) {
	try {
		const { id } = req.params
		const { username, comment } = req.body
		if (!username && !comment) throw new CustomError('empty arguments')
		if (!id) throw new CustomError('empty argument')
		const numID = parseInt(id)
		if (isNaN(numID)) throw new CustomError('incorrect ID format')
		let commentDB = await prisma.comment.findUnique({
			where: {
				id: numID
			}
		})
		if (!commentDB) throw new NotFoundError('no comment found with this ID')

		if (username !== undefined && username.trim() !== '') {
			//verif username exists
			const user = await prisma.user.findUnique({
				where: {
					username: username
				}
			})
			if (!user) throw new NotFoundError('username not found')

			//amend username
			await prisma.comment.update({
				where: {
					id: numID
				},
				data: {
					userId: user.id
				},
			})
		}

		if (comment !== undefined && comment.trim() !== '') {
			await prisma.comment.update({
				where: {
					id: numID
				},
				data: {
					text: comment
				},
			})
		}

		res.status(200).json(SuccessMsg);
	}
	catch (error) {
		if (error instanceof CustomError) res.status(400).send(`Invalid request: ${error.message}`)
		else if (error instanceof NotFoundError) res.status(404).send(`Error: ${error.message}`)
        else res.status(400).send('Error with request')
	}
}

export async function apiDeleteComment(req: Request, res: Response) {
	try {
		const { id } = req.params
		if (!id) throw new CustomError('empty argument')
		const numID = parseInt(id)
		if (isNaN(numID)) throw new CustomError('incorrect ID format')
		let commentDB = await prisma.comment.findUnique({
			where: {
				id: numID
			}
		})
		if (!commentDB) throw new NotFoundError('no comment found with this ID')

		await prisma.comment.delete({
			where: {
				id: numID
			}
		})
		
		res.status(200).json(SuccessMsg);
	}
	catch (error) {
		if (error instanceof CustomError) res.status(400).send(`Invalid request: ${error.message}`)
		else if (error instanceof NotFoundError) res.status(404).send(`Error: ${error.message}`)
        else res.status(400).send('Error with request')
	}
}