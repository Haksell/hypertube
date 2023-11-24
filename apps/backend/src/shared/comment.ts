export interface CommentDTO {
    id: number
    content: string
    updatedAt: Date
	username: string
	profilePicture: string | null
}

export interface CommentPrisma {
	id: number
	text: string
	updatedAt: Date
	user: {
		username: string
		profile_picture: string | null
	}
}

export interface MovieCommentPrisma {
	id: number
	comments: CommentPrisma[]
}