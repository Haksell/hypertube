import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import axios from "axios";

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

export async function login42(req: Request, res: Response) {
	const { code } = req.body;
	const body = {
		client_id: process.env.FORTYTWO_CLIENT_ID,
		client_secret: process.env.FORTYTWO_CLIENT_SECRET,
		code,
		redirect_uri: 'http://localhost:3000',
		grant_type: 'authorization_code',
	};
	const headers = {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	};
	const first = await axios.post('https://api.intra.42.fr/oauth/token', body, { headers });
	const { access_token } = first.data;

	const second = await axios.get('https://api.intra.42.fr/v2/me', {
		headers: {
			'Authorization': `Bearer ${access_token}`,
		},
	});
	const { login, email, first_name, last_name } = second.data;
	let user;
	const users = await prisma.user.findMany({
		where: {
			email: email,
		},
	});
	if (users.length === 0) {
		// if login is already used, add a number at the end until it's not used anymore
		let username = login;
		let i = 1;
		while (await prisma.user.findMany({ where: { username } })) {
			username = `${login}${i}`;
			i++;
		}

		user = await prisma.user.create({
			data: {
				username: username,
				firstName: first_name,
				lastName: last_name,
				email: email,
			},
		});
	} else {
		//check if user's auth method is 42
		if (users[0].authMethod !== 'FORTYTWO') {
			res.status(400).send('An account with this email already exists. Please use the usual login method: ' + users[0].authMethod);
			return;
		}
		user = users[0];
	}
	const token = jwt.sign(
		{ user_id: user.id, username: user.username, email },
		process.env.TOKEN_KEY || '',
		{
			expiresIn: '1h', // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
		},
	);
	user.token = token;
	res.status(200).send(user);
	return;
}
