import { Request } from 'express'
import { extractStr } from './get-movies'
import { CustomError } from '../types_backend/movies'

export function getMovieId(req: Request): string {
	const { movieId } = req.params
	const idStr: string = extractStr(true, movieId, 'movieId')
	if (!idStr.match('tt')) throw new CustomError('Invalid movie id')
	return idStr
}

export function getInfoMovieTorrent() {
	;
}