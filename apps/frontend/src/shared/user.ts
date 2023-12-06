import { MovieDTO } from './movies'

export type TUserContext = {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
    picture: string
    authMethod: string
    language: string
}

export type TUserProfile = {
    id: number
    username: string
    firstName: string
    lastName: string
    picture: string
    moviesLiked: []
    moviesViewed: []
}

export interface ProfileDTO {
    id: number
    username: string
    firstName: string
    lastName: string
    picture: string
    moviesLiked: MovieDTO[]
    moviesViewed: MovieDTO[]
}
