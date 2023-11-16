import { InvalidId, SuccessMsg, UnknownUsername } from '../shared/msg-error'
import { generateId } from '../utils/generate-code'
import { generateEmailBodyForgotPwd, generateEmailBodyNewUser } from '../utils/generateBodyEmail'
import { sendEmail } from '../utils/mail'
import { PrismaClient, User } from '@prisma/client'
import axios from 'axios'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
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
    const confirmID: string = generateId()
    await prisma.user.create({
        data: {
            username: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: bcrypt.hashSync(password, salt),
            salt: salt,
            email_confirm_id: confirmID,
        },
    })

    // const emailBody: string = generateEmailBodyNewUser(Username, confirmID);
    // sendEmail('Verify your account', Email, emailBody);

    res.status(201).send(SuccessMsg)
}

export async function login(req: Request, res: Response) {
    const { username, password } = req.body

    const user = await prisma.user.findMany({
        where: {
            username: username,
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
            { user_id: user[0].id, username: user[0].username, email: user[0].email },
            process.env.TOKEN_KEY || '',
            {
                expiresIn: '1h', // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
            },
        )

        res.cookie('token', token)
        res.status(200).send(user[0])
        return
    } else {
        res.status(400).send('Invalid Credentials')
        return
    }
}

export async function login42(req: Request, res: Response) {
    const { code } = req.body
    const body = {
        client_id: process.env.FORTYTWO_CLIENT_ID,
        client_secret: process.env.FORTYTWO_CLIENT_SECRET,
        code,
        redirect_uri: 'http://localhost:3000',
        grant_type: 'authorization_code',
    }
    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
    const first = await axios.post('https://api.intra.42.fr/oauth/token', body, { headers })
    const { access_token } = first.data

    const second = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    })
    const { login, email, first_name, last_name } = second.data
    let user
    const users = await prisma.user.findMany({
        where: {
            email: email,
        },
    })
    if (users.length === 0) {
        // if login is already used, add a number at the end until it's not used anymore
        let username = login
        let i = 1
        while (await prisma.user.findMany({ where: { username } })) {
            username = `${login}${i}`
            i++
        }

        user = await prisma.user.create({
            data: {
                username: username,
                firstName: first_name,
                lastName: last_name,
                email: email,
				authMethod: 'FORTYTWO',
            },
        })
    } else {
        //check if user's auth method is 42
        if (users[0].authMethod !== 'FORTYTWO') {
            res.status(400).send(
                'An account with this email already exists. Please use the usual login method: ' +
                    users[0].authMethod,
            )
            return
        }
        user = users[0]
    }
    const token = jwt.sign(
        { user_id: user.id, username: user.username, email },
        process.env.TOKEN_KEY || '',
        {
            expiresIn: '1h', // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
        },
    )
    user.token = token
    res.status(200).send(user)
    return
}

export async function ConfirmEmail(req: Request, res: Response) {
    const confirmID = req.params.confirmId
    try {
        const users = await prisma.user.findMany({
            where: {
                email_confirm_id: confirmID,
            },
        })
        if (users.length == 0) {
            res.status(400).json(InvalidId)
            return
        }

        if (users.length > 1) {
            res.status(500).json('Link error (dup) - contact admin')
            return
        }
        const user = users[0]
        if (user.email_verified === true) {
            res.status(400).json('already validated')
            return
        }

        const retour = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                email_verified: true,
            },
        })
        res.status(200).json({ msg: SuccessMsg })
    } catch (error) {
        res.status(400).json(InvalidId)
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
        if (!user) {
            res.status(400).json(UnknownUsername)
            return
        }

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

        res.status(200).json({ msg: SuccessMsg })
    } catch (error) {
        res.status(400).json(UnknownUsername)
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
        if (users.length !== 1) {
            res.status(400).json(InvalidId)
            return
        }
        res.status(200).json({ msg: SuccessMsg })
    } catch (error) {
        res.status(400).json(InvalidId)
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
        if (users.length !== 1) {
			res.status(400).json(InvalidId)
			return
		}
        //amend pwd
        const retour = await prisma.user.update({
            where: {
                id: users[0].id,
            },
            data: {
                password: bcrypt.hashSync(password, users[0].salt),
                reset_pwd: null,
            },
        })
        res.status(200).json({ msg: SuccessMsg })
    } catch (error) {
        res.status(400).json(InvalidId)
    }
}
