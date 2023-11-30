import { HttpStatusCode } from 'axios'
import { CustomError, Movie, MovieDetails } from '../types_backend/movies'
import { createMovieDB, movieViewed } from '../utils/bdd-movie'
import {
    convertRequestParams,
    extractAllMoviesDownloaded,
    getMoviesEZTV,
    getMoviesFromYTS,
} from '../utils/get-movies'
import { addDetailsFromMovieDB, getInfoMovieTorrent, getMovieId } from '../utils/info-movie'
import {
    addUserDetailsToMovie,
    addUserDetailsToMoviesList,
    getUserWithFavoritesAndViewed,
} from '../utils/user-movie'
import { PrismaClient, User } from '@prisma/client'
import { Request, Response } from 'express'
import { extractLangageSub } from '../utils/subtitles'

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
            } else if (params.type === 'series') {
                const moviesEZTV: Movie[] = await getMoviesEZTV(params.limit, params)
                if (moviesEZTV && moviesEZTV.length !== 0) movies = movies.concat(moviesEZTV)
            }
        } else {
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
    } catch (error) {
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
                imdb_code: movieId,
            },
        })
        if (!movie || movie.length !== 1) throw new CustomError('Wrong imdb code')

        //verif film deja liked
        const alreadyLike: number = user.favoriteMovies.findIndex(
            (elem) => elem.movieId === movie[0].id,
        )

        if (alreadyLike === -1) {
            await prisma.favoriteMovie.create({
                data: {
                    user: {
                        connect: { id: user.id },
                    },
                    movie: {
                        connect: { id: movie[0].id },
                    },
                    imdb_code: movie[0].imdb_code,
                },
            })
            res.status(200).send('Movie liked')
        } else {
            await prisma.favoriteMovie.delete({
                where: {
                    id: user.favoriteMovies[alreadyLike].id,
                },
            })
            res.status(200).send('Movie unliked')
        }
    } catch (error) {
        if (error instanceof CustomError) res.status(400).send(`Invalid request: ${error.message}`)
        else res.status(400).send('Movie cannot be liked')
        console.log(error)
    }
}

//get info from OpenSub
// const ffmpeg = require('fluent-ffmpeg');

export async function viewMovie(req: Request, res: Response) {
    const path = require('path')
    const fs = require('fs')

	try {
		const movieId = getMovieId(req)

		

		const videoPath = path.join('movies', `video.mp4`)
		const stat = fs.statSync(videoPath)
		const fileSize = stat.size

		const range = req.headers.range
		
		if (range) {
			const parts = range.replace(/bytes=/, '').split('-')
			const start = parseInt(parts[0], 10)
			const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

			const chuncksize = end - start + 1;
			const file = fs.createReadStream(videoPath, {start, end}) ;
			const head = {
				'Content-Range': `bytes ${start}-${end}/${fileSize}`,
				'Accept-Ranges': `bytes`,
				'Content-Length': chuncksize,
				'Content-Type': 'video/mp4'
			};
			res.writeHead(206, head); //partial response
			file.pipe(res);
		}
		else {
			const head = {
				'Content-Length': fileSize,
				'Content-Type': 'video/mp4'
			};
			res.writeHead(200, head);
			const videoStream = fs.createReadStream(videoPath)
			videoStream.pipe(res)
		}

	}
	catch (error) {
        if (error instanceof CustomError) res.status(400).send(`Invalid request: ${error.message}`)
        else res.status(404).send('Movie not found')
        console.log(error)
    }

}

    // ffmpeg()
    // .input(videoName)
    // .videoCodec('libx264')
    // .audioCodec('libmp3lame')
    // .format('mpegts')
    // .on('end', function () {
    // 	console.log('streaming video done')
    // })
    // .pipe(res, { end: true });

    // res.status(200).send('Movie')

    // const videoPath = path.join(__dirname, 'movies', videoName);

    // Envoyer la vidéo au client
    // res.sendFile(fullfilepath);
    // res.status(200).send('Movie viewed')


export async function getSubtitle(req: Request, res: Response) {
	const subFile = 'sub.vtt'
	const fs = require('fs');
	const path = require('path');

	try {
		const movieId = getMovieId(req)
		const langage = extractLangageSub(req)
		// const nameVttFile1: string = await convertSrtSubtitle(`tt0443649_en.srt`)
		// const nameVttFile2: string = await convertSrtSubtitle(`tt0443649_fr.srt`)

		const subFilename = movieId + '_' + langage + '.vtt'
		const subPath: string = path.join('movies_sub', subFilename)

		if (fs.existsSync(subPath)) {
			res.status(200).sendFile(process.cwd() + `/movies_sub/${subFilename}`, (err) => {
				if (err) {
				console.error('Erreur lors de l\'envoi du fichier :', err);
				res.status(HttpStatusCode.NotFound).send('Subtitle not found');
				}
			});
		}
		else {
			res.status(404).send('Sub not found')
		}
		
	}
	catch (error) {
        if (error instanceof CustomError) res.status(400).send(`Invalid request: ${error.message}`)
        else res.status(404).send('Sub not found')
        console.log(error)
    }
}

export async function convertSrtSubtitle(srtFile: string): Promise<string> {
	var srt2vtt = require('srt-to-vtt')
	const path = require('path')
    const fs = require('fs')

	const vttFile: string = srtFile.replace('.srt', '.vtt')

	const subPath: string = path.join('movies', srtFile)
	const vttPath: string = path.join('movies_sub', vttFile)

    fs.createReadStream(subPath)
    .pipe(srt2vtt())
    .pipe(fs.createWriteStream(vttPath))
	return vttFile
}