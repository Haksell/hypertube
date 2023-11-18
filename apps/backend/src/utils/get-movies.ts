import axios from 'axios'
import { Movie } from '../types_backend/movies'

export async function getMoviesFromYTS(limit: number, page: number): Promise<Movie[]> {
    try {
        const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?limit=${limit}`)
        const moviesYTS = response.data.data.movies
        const movies: Movie[] = []

        for (const elem of moviesYTS) {
            const oneMovie: Movie = {
                title: elem.title,
                thumbnail: elem.large_cover_image,
                year: elem.year,
                length: elem.runtime,
                imdbRating: elem.rating,
				source: 'YTS'
            }
			// console.log(oneMovie.title + ' => '+ elem.imdb_code)
            movies.push(oneMovie)
        }
        // console.log(movies)
		return movies
    } catch (error) {
		return []
    }
}

type InfoMovie = {
	thumbnail: string;
    year: number;
    length: number;
    imdbRating: number;
}

// get movies from EZTV source and update them with movieDB source
export async function getMoviesEZTV(limit: number, page: number): Promise<Movie[]> {
	try {
		const response = await axios.get(`https://eztv.re/api/get-torrents?limit=${limit}&page=${page}`)
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