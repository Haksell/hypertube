import axios from 'axios'
import { Request, Response } from 'express'

type Movie = {
    title: string
    thumbnail: string
    year: number
    length: number
    imdbRating?: number
}

let moviesHardCoded: Movie[] = [
    {
        title: 'Oppenheimer',
        thumbnail: '/dev_thumbnails/oppenheimer.jpg',
        year: 2023,
        length: 162,
        imdbRating: 8.5,
    },
    {
        title: 'Rumble Through the Dark',
        thumbnail: '/dev_thumbnails/rumble_through_the_dark.jpg',
        year: 2023,
        length: 162,
        imdbRating: 6.2,
    },
    {
        title: 'The Killer',
        thumbnail: '/dev_thumbnails/the_killer.jpg',
        year: 2023,
        length: 162,
    },
    {
        title: 'The Creator',
        thumbnail: '/dev_thumbnails/the_creator.jpg',
        year: 2023,
        length: 162,
    },
    {
        title: 'The Death',
        thumbnail: '/dev_thumbnails/the_death.jpg',
        year: 2023,
        length: 162,
    },
    {
        title: 'Spirit of Fear',
        thumbnail: '/dev_thumbnails/spirit_of_fear.jpg',
        year: 2023,
        length: 162,
    },
    {
        title: "OSS 117: Le Caire, nid d'espions",
        thumbnail: '/dev_thumbnails/oss117.jpg',
        year: 2006,
        length: 99,
    },
]

export async function getMovies(req: Request, res: Response) {
    // const moviesYTS: Movie[] = await getMoviesFromYTS(20, 1)
	const moviesYTS: Movie[] = await getMoviesEZTV(2,1)
    res.status(201).send(moviesYTS)
}

// http://localhost:5001/movies?genra=love,comic&grade=5&prod=1998,1999&sort=downloads&limit=10&offset=10
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
            }
			console.log(oneMovie.title + ' => '+ elem.imdb_code)
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

export async function getMoviesEZTV(limit: number, page: number): Promise<Movie[]> {
	try {
		const response = await axios.get(`https://eztv.re/api/get-torrents?limit=${limit}&page=${page}`)
		// const response = await axios.get(`https://yts.torrentbay.net/api/v2/list_movies.json`)
		const moviesEZTV = response.data.torrents
		const movies: Movie[] = []

		for (const elem of moviesEZTV) {
			const info = await getInfoMovie(elem.imdb_id)
			const oneMovie: Movie = {
				title: elem.title,
                thumbnail: 'http:' + elem.large_screenshot,
                year: elem.year,
                length: elem.runtime,
                imdbRating: elem.rating,
			}
			console.log(oneMovie.title + ' => '+ elem.imdb_id)
			movies.push(oneMovie)
		}

		// console.log(movies)
		return movies

		// https://yts.torrentbay.net/api/v2/list_movies.json
        // const moviesEZ = response.data.data.movies
		
	}
	catch (error) {
		// console.log(error.response)
		return []
	}
}

async function getInfoMovie(movie_id: string): Promise<InfoMovie | null> {

	try {
		const response = await axios.get(`https://api.themoviedb.org/3/movie/tt${movie_id}`, {
			headers: {
			  Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NDg3ODYyZmFlNzIzOTg1NGU0M2EwZWViOTY0ZTQ4OSIsInN1YiI6IjY1NTI0MzllMDgxNmM3MDBjM2Q5ZWI3YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HLvzT_4FESs2smv0k8-zAqEXHgnLS4t9QFmnIwX4Nno`,
			  accept: 'application/json',
			}
		  });
		
		const data = response.data
		console.log(data)

		// const info: InfoMovie = {
		// 	thumbnail: string;
		// 	year: number;
		// 	length: number;
		// 	imdbRating
		// }
		return null
	}
	catch (error ) {
		console.log('cannot get '+movie_id)
		console.log(error)
		return null
	}
}