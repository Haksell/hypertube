import axios from 'axios'
import { CustomError, Movie, TRequestGetMovie, movieParamSortBy } from '../types_backend/movies'
import { Request } from 'express'

type TRequete = {
	limit: number
	page: number
	sort_by: string
	query_term?: string
	genre?: string
	minimum_rating? : number
}

//`https://yts.mx/api/v2/list_movies.json?limit=${limit}&page=${params.offset}`
export async function getMoviesFromYTS(limit: number, params: TRequestGetMovie): Promise<Movie[]> {
    try {
		const parameters: TRequete = {
			limit: limit,
			page: params.offset,
			sort_by: params.sort,
		}
		if (limit === 125) parameters.query_term = '0'
		if (params.genre.length !== 0) parameters.genre = tabToString(params.genre)
		if (params.grade !== -1) parameters.minimum_rating = params.grade
        const response = await axios.get(`https://yts.mx/api/v2/list_movies.json`, 
			{
				params: parameters
		})

		console.log(response.config.url)
		console.log(response.config.params)
        const moviesYTS = response.data.data.movies
        const movies: Movie[] = []

        for (const elem of moviesYTS) {
            const oneMovie: Movie = {
                title: elem.title,
                thumbnail: elem.large_cover_image,
                year: elem.year,
                length: elem.runtime,
                imdbRating: elem.rating,
				imdb_code: elem.imdb_code,
				langage: elem.language,
				genre: elem.genres,
				seeds: elem.torrents.seeds,
				quality: elem.torrents.quality,
				url: elem.torrents.url,
				source: 'YTS',
            }
            movies.push(oneMovie)
        }
		return movies
    } catch (error) {
		return []
    }
}

function tabToString(tab: string[]): string {
	let str: string = ''
	let i = 0
	for (const elem of tab) {
		if (i === 0)
			str = elem
		else {
			str = str + ',' + elem
		}
		i = i + 1
	}
	return str
}

type InfoMovie = {
	thumbnail: string;
    year: number;
    length: number;
    imdbRating: number;
}

// get movies from EZTV source and update them with movieDB source
export async function getMoviesEZTV(limit: number, params: TRequestGetMovie): Promise<Movie[]> {
	try {
		const response = await axios.get(`https://eztv.re/api/get-torrents?limit=${limit}&page=${params.offset}`)
		const moviesEZTV = response.data.torrents
		const movies: Movie[] = []

		for (const elem of moviesEZTV) {
			let info = null
			if (elem.imdb_id && elem.imdb_id !== 0) {
				info = await getInfoMovie(`tt${elem.imdb_id}`)
			}
			let oneMovie: Movie = {
				title: elem.title,
                thumbnail: 'http:' + elem.large_screenshot,
                year: elem.year,
                length: elem.runtime,
                imdbRating: elem.rating,
				imdb_code: elem.imdb_code,
				langage: '',
				genre: [],
				seeds: elem.seeds,
				quality: '',
				url: elem.torrent_url,
				source: 'EZTV'
			}
			if (info) {
				if (info.thumbnail !== '')
					oneMovie.thumbnail = info.thumbnail
				oneMovie.year = info.year
				oneMovie.imdbRating = info.imdbRating

				movies.push(oneMovie)
			}			
		}
		return movies		
	}
	catch (error) {
		return []
	}
}

// use themoviedb source to extract informations about movies/tv_shows ()
async function getInfoMovie(movie_id: string): Promise<InfoMovie | null> {
	try {
		const response = await axios.get(`https://api.themoviedb.org/3/find/${movie_id}?external_source=imdb_id`, {
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${process.env.MOVIEDB_TOKEN}`,
			}
		  });
		
		const data = response.data
		let image: string = ''

		// if TV_result
		if (data.tv_results.length !== 0) {
			const tv = data.tv_results[0]
			if (tv.poster_path)
				image = `https://image.tmdb.org/t/p/w500${tv.poster_path}`
			const year: number = parseInt(tv.first_air_date.substr(0,4))
			return {
				thumbnail: image,
				year: year,
				length: 0,
				imdbRating: tv.vote_average,
			}
		}
		return null
	}
	catch (error: any) {
		// console.log('cannot get '+movie_id)
		return null
	}
}

// 	yearRange: Joi.number(),
// 	language: Joi.string(),
// 	search: Joi.string(),


export function convertRequestParams(req: Request): TRequestGetMovie {
    const { genre, minGrade, prod, sortBy, limit, offset } = req.query
	console.log('here we come')
    const limitNB: number = extractInt(true, limit, 'limit')
    const offsetNB: number = extractInt(true, offset, 'offset')
    const gradeNB: number = extractInt(false, minGrade, 'minGrade')
    const prodNB: number = extractInt(false, prod, 'prod')
	const sortStr: string = extractStr(true, sortBy, 'sortBy', 'seeds')
	if (!movieParamSortBy.includes(sortStr)) throw new CustomError(`params sort is incorrect`)
	const genresStr: string = extractStr(false, genre, 'genre')
	const genreTab: string[] = genresStr === '' ? [] : genresStr.split(',')
    let params: TRequestGetMovie = {
        genre: genreTab,
        grade: gradeNB,
        prod: prodNB,
        sort: sortStr,
        limit: limitNB,
        offset: offsetNB,
    }
    return params
}

function extractInt(mandatory: boolean, variable: any, name: string): number {
    if (!mandatory && !variable) return -1
    if (mandatory && !variable && variable !== 0) throw new CustomError(`params ${name} is mandatory`)
    const limitNB: number = Array.isArray(variable) ? parseInt(variable[0]) : parseInt(variable)
    return limitNB
}

function extractStr(mandatory: boolean, variable: any, name: string, def?: string): string {
    if (!mandatory && !variable) return def ? def : ''
    if (mandatory && !variable) throw new CustomError(`params ${name} is mandatory`)
    const str: string = Array.isArray(variable) ? variable[0] : variable
    return str
}
