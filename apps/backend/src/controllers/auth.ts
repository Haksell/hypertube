import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function register(req: Request, res: Response) {
	const { username, email, password, firstName, lastName } = req.body

	// Check password is complex enough
	if (password.length < 8) {
		res.status(400).send('Password is too short')
		return
	}

	// Check if a user with email OR with username already exists
	let user = await prisma.user.findMany({
		where: {
			email: email,
		},
	})

	if (user.length > 0) {
		res.status(400).send('User already exists. Please login')
		return
	}

	user = await prisma.user.findMany({
		where: {
			username: username,
		},
	})

	if (user.length > 0) {
		res.status(400).send('Username is already taken. Please try another')
		return
	}

	const salt = bcrypt.genSaltSync(10)

	await prisma.user.create({
		data: {
			username: username,
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: bcrypt.hashSync(password, salt),
			salt: salt,
		},
	})

	res.status(201).send('Successfully registered')
}

export async function login(req: Request, res: Response) {
	const { email, password } = req.body

	const user = await prisma.user.findMany({
		where: {
			email: email,
		},
	})

	if (user.length === 0) {
		res.status(400).send('Invalid Credentials')
		return
	}

	// * CHECK IF PASSWORD IS CORRECT
	const PHash = bcrypt.hashSync(password, user[0].salt)
	if (PHash === user[0].password) {
		// * CREATE JWT TOKEN
		const token = jwt.sign(
			{ user_id: user[0].id, username: user[0].username, email },
			process.env.TOKEN_KEY || '',
			{
				expiresIn: '1h', // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
			},
		)

		user[0].token = token
		res.status(200).send(user[0])
		return
	} else {
		res.status(400).send('Invalid Credentials')
		return
	}
}
