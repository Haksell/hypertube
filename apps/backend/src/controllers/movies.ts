import { CustomError, Movie } from '../types_backend/movies'
import { convertRequestParams, getMoviesEZTV, getMoviesFromYTS } from '../utils/get-movies'
import { Request, Response } from 'express'

export async function getMovies(req: Request, res: Response) {
    try {
        const params = convertRequestParams(req)
        const moviesYTS: Movie[] = await getMoviesFromYTS(15, 1)
        const moviesEZTV: Movie[] = await getMoviesEZTV(5, 1)

        // assemble both
        let movies: Movie[] = []
        if (moviesYTS && moviesYTS.length !== 0) movies = movies.concat(moviesYTS)
        if (moviesEZTV && moviesEZTV.length !== 0) movies = movies.concat(moviesEZTV)

		// sorting data
        res.status(201).send(movies)
    } catch (error) {
        if (error instanceof CustomError) res.status(400).send(`Invalid request: ${error.message}`)
        else res.status(400).send('Error')
    }
}

// http://localhost:5001/movies?genra=love,comic&grade=5&prod=1998,1999&sort=downloads&limit=10&offset=10
