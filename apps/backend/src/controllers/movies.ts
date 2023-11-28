import { CustomError, Movie, MovieDetails } from '../types_backend/movies'
import { convertRequestParams, extractAllMoviesDownloaded, getMoviesEZTV, getMoviesFromYTS } from '../utils/get-movies'
import { Request, Response } from 'express'
import { addDetailsFromMovieDB, getInfoMovieTorrent, getMovieId } from '../utils/info-movie'
import { createMovieDB, movieViewed } from '../utils/bdd-movie'
import { PrismaClient, User } from '@prisma/client'
import { addUserDetailsToMovie, addUserDetailsToMoviesList, getUserWithFavoritesAndViewed } from '../utils/user-movie'

const prisma = new PrismaClient()

export async function getMovies(req: Request, res: Response) {
    try {
        const params = convertRequestParams(req)
		console.log(params)

		const user: User = await getUserWithFavoritesAndViewed(req)

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
			const moviesYTS: Movie[] = await extractAllMoviesDownloaded()
			if (moviesYTS && moviesYTS.length !== 0) movies = movies.concat(moviesYTS)
		}

		await addUserDetailsToMoviesList(user, movies)
        
        res.status(201).send(movies)
    } catch (error) {
        if (error instanceof CustomError) res.status(400).send(`Invalid request: ${error.message}`)
        else res.status(400).send('Error')
		console.log(error)
    }
}

export async function getMovieInfo(req: Request, res: Response) {
	try {
		const movieId = getMovieId(req)

		const user: User = await getUserWithFavoritesAndViewed(req)

		//get info from YTS
		let movie: MovieDetails = await getInfoMovieTorrent(movieId)

		//get info from TheMovieDB
		await addDetailsFromMovieDB(movie)

		//add info from user (already viewed / already liked)
		await addUserDetailsToMovie(user, movie)

		// verif si film existe deja dans BDD. Si non, ajout dans BDD
		await createMovieDB(movie)

		//add movie to viewed By user
		movieViewed(user, movieId)
		
		// console.log(movie)
		res.status(201).send(movie)
	}
	catch (error) {
		if (error instanceof CustomError) res.status(400).send(`Invalid request: ${error.message}`)
        else res.status(400).send('Error')
	}

}

export async function likeMovie(req: Request, res: Response) {
	try {
		//recupere user
		const user = await getUserWithFavoritesAndViewed(req)

		//verifie film existe
		const movieId = getMovieId(req)
		const movie = await prisma.movies.findMany({
			where: {
				imdb_code: movieId
			}
		})
		if (!movie || movie.length !== 1) throw new CustomError('Wrong imdb code')

		//verif film deja liked
		const alreadyLike: number = user.favoriteMovies.findIndex(elem => elem.movieId === movie[0].id)

		if (alreadyLike === -1) {
			await prisma.favoriteMovie.create({
				data: {
					user: { 
						connect: { id: user.id }
					},
					movie: {
						connect: { id: movie[0].id }
					},
					imdb_code: movie[0].imdb_code
				}
			})
			res.status(200).send('Movie liked')
		}
		else {
			await prisma.favoriteMovie.delete({
				where: {
					id: user.favoriteMovies[alreadyLike].id
				}
			})
			res.status(200).send('Movie unliked')
		}
	}
	catch (error) {
		if (error instanceof CustomError) res.status(400).send(`Invalid request: ${error.message}`)
        else res.status(400).send('Movie cannot be liked')
	console.log(error)
	}
}

//get info from OpenSub

export async function viewMovie(req: Request, res: Response) {
	// const path = require('path');
	const videoName = 'movies/video1.mp4';
	console.log('we come here');

    // const dirname = path.resolve()
    // const fullfilepath = path.join(dirname, 'movies/' + videoName)

	const ffmpeg = require('fluent-ffmpeg');

	console.log('we come at least here')

	ffmpeg()
    .input(videoName)
    .videoCodec('libx264')
    .audioCodec('libmp3lame')
    .format('mpegts')
    .pipe(res, { end: true });

	// res.status(200).send('Movie')

	
	// const videoPath = path.join(__dirname, 'movies', videoName);
  
	// Envoyer la vidéo au client
	// res.sendFile(fullfilepath);
	// res.status(200).send('Movie viewed')
}