import { CustomError, Movie } from '../types_backend/movies'
import { convertRequestParams, getMoviesEZTV, getMoviesFromYTS } from '../utils/get-movies'
import { Request, Response } from 'express'

export async function getMovies(req: Request, res: Response) {
	console.log('coming first')
    try {
        const params = convertRequestParams(req)
		console.log(params)

		let movies: Movie[] = []

		// const repartition: number = Math.floor((params.limit / 4) * 3)
		if (params.downloaded === 'no') {
			if (params.type === 'movie') {
				const moviesYTS: Movie[] = await getMoviesFromYTS(params.limit, params)
				if (moviesYTS && moviesYTS.length !== 0) movies = movies.concat(moviesYTS)
			}
			else if (params.type === 'series') {
				const moviesEZTV: Movie[] = await getMoviesEZTV(params.limit, params)
				if (moviesEZTV && moviesEZTV.length !== 0) movies = movies.concat(moviesEZTV)
			}
			
		}
		else {
			//;
		}
        
		// sorting data
        res.status(201).send(movies)
    } catch (error) {
        if (error instanceof CustomError) res.status(400).send(`Invalid request: ${error.message}`)
        else res.status(400).send('Error')
    }
}

// http://localhost:5001/movies?genra=love,comic&grade=5&prod=1998,1999&sort=downloads&limit=10&offset=10
