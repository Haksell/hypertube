import { TUserContext } from '../shared/user'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Take a prisma User and return a TUserContext
export const formatUser = (user: any): TUserContext => {
    return {
        id: user.user_id,
        username: user.username,
        authMethod: user.authMethod,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.profile_picture,
    }
}

// Take a username and concatenate it with a number until it is unique
export const generateUniqueUsername = async (login: string): Promise<string> => {
	let username = login
    let i = 1
    while ((await prisma.user.findMany({ where: { username } })).length > 0) {
        username = `${login}${i}`
        i++
    }

    return username
}
