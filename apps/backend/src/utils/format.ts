<<<<<<< HEAD
import { CommentDTO, CommentPrisma } from '../shared/comment'
import { TUserContext } from '../shared/user'
=======
import { TUserContext, ProfileDTO, TUserProfile, ProfilePrisma } from '../shared/user'
>>>>>>> Ncoursol
import { PrismaClient } from '@prisma/client'
import { getInfoMovieTorrent } from './info-movie'
import { MovieDTO } from '../shared/movies'

const prisma = new PrismaClient()

// Take a prisma User and return a TUserContext
export const formatUser = (user: any): TUserContext => {
    return {
        id: user.id,
        username: user.username,
        authMethod: user.authMethod,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.profile_picture,
        emailConfirmed: user.email_verified,
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

<<<<<<< HEAD
// Take a prisma Comment and return a CommentDTO
export const formatComment = (comment: CommentPrisma): CommentDTO => {
    return {
        id: comment.id,
        content: comment.text,
        updatedAt: comment.updatedAt,
        username: comment.user.username,
        profilePicture: comment.user.profile_picture || null,
        userId: comment.user.id,
    }
}
=======
export const formatProfile = async (profile: ProfilePrisma): Promise<ProfileDTO> => {
    const viewedMovies = await Promise.all(profile.viewedMovies.map(mov => getInfoMovieTorrent(mov.imdb_code)))
    const favoriteMovies = await Promise.all(profile.favoriteMovies.map(mov => getInfoMovieTorrent(mov.imdb_code)))

    const formattedViewedMovies: MovieDTO[] = viewedMovies.map(mov => {
        const formattedMovie: MovieDTO = {
            ...mov,
            thumbnail: mov.image.poster,
            length: mov.runtime,
            genre: mov.genres,
            seeds: 0,
            quality: 'yolo',
            url: mov.yt_trailer_code,
            viewed: true,
            source: "EZTV"
        }
        return formattedMovie
    })

    const formattedFavoriteMovies: MovieDTO[] = favoriteMovies.map(mov => {
        const formattedMovie: MovieDTO = {
            ...mov,
            thumbnail: mov.image.poster,
            length: mov.runtime,
            genre: mov.genres,
            seeds: 0,
            quality: 'yolo',
            url: mov.yt_trailer_code,
            viewed: true,
            source: "EZTV"
        }
        return formattedMovie
    })
    return {
        id: profile.id,
        username: profile.username,
        firstName: profile.firstName,
        lastName: profile.lastName,
        profilePicture: profile.profile_picture,
        moviesLiked: formattedFavoriteMovies,
        moviesViewed: formattedViewedMovies
    }
}
>>>>>>> Ncoursol
