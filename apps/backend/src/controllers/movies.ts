import { Movie } from '../types_backend/movies'
import { getMoviesEZTV, getMoviesFromYTS } from '../utils/get-movies'
import { Request, Response } from 'express'

export type TRequestGetMovie = {
    genra: string[]
    grade: number
    prod: number
    sort: string
    limit: number
    offset: number
}

class CustomError extends Error {
    constructor(message: string) {
        super(message)
    }
}

export async function getMovies(req: Request, res: Response) {
    try {
        const params = convertRequestParams(req)
        const moviesYTS: Movie[] = await getMoviesFromYTS(15, 1)
        const moviesEZTV: Movie[] = await getMoviesEZTV(5, 1)

        // assemble both
        let movies: Movie[] = []
        if (moviesYTS && moviesYTS.length !== 0) movies = movies.concat(moviesYTS)

        if (moviesEZTV && moviesEZTV.length !== 0) movies = movies.concat(moviesEZTV)
        res.status(201).send(movies)
    } catch (error) {
        if (error instanceof CustomError) res.status(400).send(`Invalid request: ${error.message}`)
        else res.status(400).send('Error')
    }
}

export function convertRequestParams(req: Request): TRequestGetMovie {
    const { genra, grade, prod, sort, limit, offset } = req.query
	console.log('params: limit='+limit + ', offset='+offset)
    if (!limit) throw new CustomError('params limit is mandatory')
    if (!offset) throw new CustomError('params offset is mandatory')
	if (!(limit instanceof String)) throw new CustomError('params limit must be unique')
	// if (limit.lenght )
	// const limitNB = parseInt(limit)
    let params: TRequestGetMovie = {
        genra: [],
        grade: 0,
        prod: 0,
        sort: 'seed',
        limit: 0,
        offset: 0,
    }
    return params
}
// http://localhost:5001/movies?genra=love,comic&grade=5&prod=1998,1999&sort=downloads&limit=10&offset=10
