
export type Movie = {
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
    source: 'EZTV' | 'YTS'
}

export type TRequestGetMovie = {
    genre: string[]
    grade: number
    prod: number
    sort: string
    limit: number
    offset: number
}

export class CustomError extends Error {
    constructor(message: string) {
        super(message)
    }
}

export const genres = [
    'Action',
    'Adventure',
    'Animation',
    'Comedy',
    'Crime',
    'Documentary',
    'Drama',
    'Family',
    'Fantasy',
    'History',
    'Horror',
    'Music',
    'Mystery',
    'Romance',
    'Science-Fiction',
    'TV Movie',
    'Thriller',
    'War',
    'Western',
]

export const movieParamSortBy = [
    'title',
    'year',
    'rating',
    'peers',
    'seeds',
    'download_count',
    'like_count',
    'date_added',
]
