import { NotConnected } from '../shared/msg-error'
import { CustomError, MovieDetails } from '../types_backend/movies'
import { TUserCookie } from '../types_backend/user-cookie'
import { PrismaClient, User } from '@prisma/client'
import { Request } from 'express'

const prisma = new PrismaClient()

export async function getUserWithFavoritesAndViewed(req: Request) {
    const decoded: TUserCookie = req.user
    const user = await prisma.user.findUnique({
        where: {
            username: decoded.username,
        },
        include: {
            favoriteMovies: { include: { movie: true } },
			viewedMovies: { include: { movie: true } },
        },
    })
    if (!user) throw new CustomError(NotConnected)
	return user
}

export async function addUserDetailsToMovie(user: any, movie: MovieDetails) {
	//verif film deja liked
	// const alreadyLike: number = user.favoriteMovies.findIndex((elem: any) => elem. === movie.imdb_code)
}
