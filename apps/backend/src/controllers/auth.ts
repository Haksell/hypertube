import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function register(req: Request, res: Response) {
	const { username, email, password, firstName, lastName } = req.body

	const user = await prisma.user.findMany({
		where: {
			email: email,
		},
	})

	if (user.length > 0) {
		res.status(400).send('User already exists. Please login')
		return
	}

	var salt = bcrypt.genSaltSync(10)
	const newUser = await prisma.user.create({
		data: {
			username: username,
			firstName: 'user1',
			lastName: 'example',
			email: email,
			password: bcrypt.hashSync(password, salt),
			salt: salt,
		},
	})

	res.status(201).send({ msg: 'Success' })
}

export async function login(req: Request, res: Response) {
	const { Email, Password } = req.body

	const user = await prisma.user.findMany({
		where: {
			email: Email,
		},
	})

	if (user.length === 0) {
		res.status(400).send({ error: 'User does not exist. Please register' })
		return
	}

	// * CHECK IF PASSWORD IS CORRECT
	const PHash = bcrypt.hashSync(Password, user[0].salt)
	if (PHash === user[0].password) {
		// * CREATE JWT TOKEN
		const token = jwt.sign(
			{ user_id: user[0].id, username: user[0].username, Email },
			process.env.TOKEN_KEY || '',
			{
				expiresIn: '1h', // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
			},
		)

		user[0].token = token
		res.status(200).send({ user: user[0] })
		return
	} else {
		res.status(400).send({ msg: 'No Match' })
		return
	}
}
