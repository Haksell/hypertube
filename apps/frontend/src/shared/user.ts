export type TUserContext = {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
    picture: string
    authMethod: string
}

export type TUserProfile = {
	id: number;
	username: string
    firstName: string
    lastName: string
    picture: string
	moviesLiked: []
	moviesViewed: []
}
