import axios from 'axios'
import { Request, Response } from 'express'
import { getMoviesEZTV, getMoviesFromYTS } from '../utils/get-movies'

type Movie = {
    title: string
    thumbnail: string
    year: number
    length: number
    imdbRating?: number
	source: 'EZTV' | 'YTS'
}

export async function getMovies(req: Request, res: Response) {
    const moviesYTS: Movie[] = await getMoviesFromYTS(15, 1)
	const moviesEZTV: Movie[] = await getMoviesEZTV(5,1)
	
	// assemble both
	let movies: Movie[] = []
	if (moviesYTS && moviesYTS.length !== 0)
		movies = movies.concat(moviesYTS)
		
	if (moviesEZTV && moviesEZTV.length !== 0)
		movies = movies.concat(moviesEZTV)
    res.status(201).send(movies)
}

// http://localhost:5001/movies?genra=love,comic&grade=5&prod=1998,1999&sort=downloads&limit=10&offset=10
