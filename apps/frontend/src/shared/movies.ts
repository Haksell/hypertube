export type MovieDetails = {
	imdb_code: string
	title: string
	year: number
	rating: number
	runtime: number
	langage: string
	genres: string[]
	summary: string
	description_full: string
	yt_trailer_code: string
	image: MovieImage
	actors: MovieActor[]
	crews: MovieCrew[]
	budget?: number
}

export type MovieImage = {
	background?: string
	poster: string
}

export type MovieCrew = {
	department?: string
	job?: string
	name: string
	image?: string
}

export type MovieActor = {
	known_for_department?: string
	name: string
	character: string
	image?: string
}

export interface MovieDTO {
    title: string
    thumbnail: string
    year: number
    length: number
    imdbRating?: number
    imdb_code: string
    langage: string
    genre: string[]
    seeds: number
    quality: string
    url: string
    viewed: boolean
    liked: boolean
    source: 'EZTV' | 'YTS'
}