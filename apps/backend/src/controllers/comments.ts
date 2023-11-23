import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient()

export async function getComments(req: Request, res: Response) {
	// returns a list of latest comments which includes comment’s author username, date, content, and id
	const comments = await prisma.comment.findMany({
		take: 10,
		select: {
			id: true,
			text: true,
			updatedAt: true,
			user: {
				select: {
					username: true
				}
			}
		}
	})
	res.status(200).send(comments)
}

export async function getComment(req: Request, res: Response) {
	const { commentId } = req.params

	const comment = await prisma.comment.findUnique({
		where: {
			id: parseInt(commentId)
		},
		select: {
			id: true,
			text: true,
			updatedAt: true,
			user: {
				select: {
					username: true
				}
			}
		}
	})

	if (!comment) {
		res.status(400).send('invalidCommentId')
		return
	}

	res.status(200).send(comment)
}

export async function updateComment(req: Request, res: Response) {
	const { commentId } = req.params

	const comment = await prisma.comment.findUnique({
		where: {
			id: parseInt(commentId)
		}
	})

	if (!comment) {
		res.status(400).send('invalidCommentId')
		return
	}

	const { comment: newComment } = req.body

	await prisma.comment.update({
		where: {
			id: parseInt(commentId)
		},
		data: {
			text: newComment
		}
	})

	res.status(200).send('commentUpdated')
}

export async function deleteComment(req: Request, res: Response) {
	const { commentId } = req.params

	const comment = await prisma.comment.findUnique({
		where: {
			id: parseInt(commentId)
		}
	})

	if (!comment) {
		res.status(400).send('invalidCommentId')
		return
	}

	await prisma.comment.delete({
		where: {
			id: parseInt(commentId)
		}
	})

	res.status(200).send('commentDeleted')
}

export async function createComment(req: Request, res: Response) {
	const { comment, imdbCode } = req.body

	const movie = await prisma.movies.findFirst({
		where: {
			imdb_code: imdbCode
		}
	})

	if (!movie) {
		res.status(400).send('invalidMovieId')
		return
	}

	await prisma.comment.create({
		data: {
			text: comment,
			userId: req.user.user_id,
			movieId: movie.id
		}
	})

	res.status(200).send('commentCreated')
}

export async function getMovieComments(req: Request, res: Response) {
	const { movieId } = req.params

	const movie = await prisma.movies.findFirst({
		where: {
			imdb_code: movieId
		},
		select: {
			id: true,
			comments: {
				select: {
					id: true,
					text: true,
					updatedAt: true,
					user: {
						select: {
							profile_picture: true,
							username: true
						}
					}
				}
			}
		}
	})

	

	if (!movie) {
		res.status(400).send('invalidMovieId')
		return
	}

	// Display movie in a pretty json format
	console.log(JSON.stringify(movie, null, 2))

	res.status(200).send(movie.comments)
}
