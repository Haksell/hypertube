import { InvalidId, SuccessMsg, UnknownUsername } from '../shared/msg-error'
import { TUserCookie } from '../types_backend/user-cookie'
import { generateId } from '../utils/generate-code'
import { generateEmailBodyForgotPwd, generateEmailBodyNewUser } from '../utils/generateBodyEmail'
import { sendEmail } from '../utils/mail'
import { PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function register(req: Request, res: Response) {
    var errors = []
    const { Username, Email, Password, FirstName, LastName } = req.body

    if (!Username) {
        errors.push('Username is missing')
    }
    if (!Email) {
        errors.push('Email is missing')
    }
    if (errors.length) {
        res.status(400).json({ error: errors.join(',') })
        return
    }

    const user = await prisma.user.findMany({
        where: {
            OR: [
                {
                    email: Email,
                },
                {
                    username: Username,
                },
            ],
        },
    })

    if (user.length > 0) {
        res.status(400).send('User already exists. Please login')
        return
    }

    var salt = bcrypt.genSaltSync(10)
    const confirmID: string = generateId()
    const newUser = await prisma.user.create({
        data: {
            username: Username,
            firstName: FirstName,
            lastName: LastName,
            email: Email,
            password: bcrypt.hashSync(Password, salt),
            salt: salt,
            email_confirm_id: confirmID,
        },
    })

    // const emailBody: string = generateEmailBodyNewUser(Username, confirmID);
    // sendEmail('Verify your account', Email, emailBody);

    res.status(201).send({ msg: 'Success' })
}

export async function login(req: Request, res: Response) {
    const { Username, Password } = req.body
    // Make sure there is an Email and Password in the request
    if (!(Username && Password)) {
        res.status(400).send('All input is required')
        return
    }

    const user = await prisma.user.findMany({
        where: {
            username: Username,
        },
    })

    if (user.length === 0) {
        res.status(400).send('User does not exist. Please register')
        return
    }

    // * CHECK IF PASSWORD IS CORRECT
    const PHash = bcrypt.hashSync(Password, user[0].salt)
    if (PHash === user[0].password) {
        // * CREATE JWT TOKEN
		const content: TUserCookie = { user_id: user[0].id, username: user[0].username, email: user[0].email }
        const token = jwt.sign(
            content,
            process.env.TOKEN_KEY || '',
            {
                expiresIn: '1h', // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
            },
        )

        user[0].token = token
		res.cookie('token', token)
        res.status(200).send({ user: user[0] })
        return
    } else {
        res.status(400).send('Incorrect password')
        return
    }
}

export async function ConfirmEmail(req: Request, res: Response) {
    const confirmID = req.params.confirmId
    try {
        const users = await prisma.user.findMany({
            where: {
                email_confirm_id: confirmID,
            },
        })
        if (users.length == 0) return res.status(400).json(InvalidId)
        if (users.length > 1) return res.status(500).json('Link error (dup) - contact admin')
        const user = users[0]
        if (user.email_verified === true) return res.status(400).json('already validated')
        const retour = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                email_verified: true,
            },
        })
        return res.status(200).json({ msg: SuccessMsg })
    } catch (error) {
        return res.status(400).json(InvalidId)
    }
}

export async function ForgotPwd(req: Request, res: Response) {
    const { email } = req.body

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        })
        if (!user) return res.status(400).json(UnknownUsername)

        // generate a link to reset pwd
        const confirmID: string = generateId()
        // amend profile with the code
        const retour = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                reset_pwd: confirmID,
            },
        })
        console.log(retour)

        // send Email
        // const emailBody: string = generateEmailBodyForgotPwd(user.username, confirmID);
        // sendEmail('Reset your password', email, emailBody);

        return res.status(200).json({ msg: SuccessMsg })
    } catch (error) {
        return res.status(400).json(UnknownUsername)
    }
}

export async function ConfirmForgotPwd(req: Request, res: Response) {
    const confirmID = req.params.confirmId
	try {
		const users = await prisma.user.findMany({
            where: {
                reset_pwd: confirmID,
            },
        })
		if (users.length !== 1)
			return res.status(400).json(InvalidId)
		return res.status(200).json({ msg: SuccessMsg })
	}
	catch (error) {
		return res.status(400).json(InvalidId)
	}
}

export async function ResetPwd(req: Request, res: Response) {
    const confirmID = req.params.confirmId
    const { password } = req.body

	try {
		const users = await prisma.user.findMany({
            where: {
                reset_pwd: confirmID,
            },
        })
		if (users.length !== 1)
			return res.status(400).json(InvalidId)
		//amend pwd
		const retour = await prisma.user.update({
			where: {
				id: users[0].id,
			},
			data:{
				password: bcrypt.hashSync(password, users[0].salt),
				reset_pwd: null,
			}
		})
		return res.status(200).json({ msg: SuccessMsg })
	}
	catch (error) {
		return res.status(400).json(InvalidId)
	}
}
