import { Request } from 'express'
import { extractStr } from './get-movies'
import { CustomError, MovieDetails, MovieImage } from '../types_backend/movies'
import axios from 'axios'

export function getMovieId(req: Request): string {
	const { movieId } = req.params
	const idStr: string = extractStr(true, movieId, 'movieId')
	if (!idStr.match('tt')) throw new CustomError('Invalid movie id')
	return idStr
}

export async function getInfoMovieTorrent(movieId: string): Promise<MovieDetails> {
	try {
		const response = await axios.get(`https://yts.mx/api/v2/movie_details.json`, 
			{
				params: {
					imdb_id: movieId
				}
		})
		console.log(response.data)
		if (response.data.status !== 'ok') throw new CustomError('Code not found')
		if (response.data.data.movie.imdb_code !== movieId) throw new CustomError('Code not found')

		const movie = response.data.data.movie

		const images: MovieImage = {
			background: movie.background_image,
			poster: movie.large_cover_image,
		}
		const retour: MovieDetails = {
			imdb_code: movieId,
			title: movie.title,
			year: movie.year,
			rating: movie.rating,
			runtime: movie.runtime,
			langage: movie.language,
			genres: movie.genres,
			summary: movie.summary,
			description_full: movie.description_full,
			yt_trailer_code: movie.yt_trailer_code,
			image: images,
			actors: [],
			crews: [],
		}
		return retour
	}
	catch {
		throw new CustomError('Code not found')
	}
}