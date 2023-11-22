import { PrismaClient } from "@prisma/client";
import { MovieDetails } from "../types_backend/movies";
import { tabToString } from "./get-movies";

const prisma = new PrismaClient()

export async function createMovieDB(movie: MovieDetails) {
	try {
		const movies = await prisma.movies.findMany({
			where: {
				imdb_code: movie.imdb_code
			}
		})
		if (movies && movies.length !== 0)
			return false

		//creation film dans BDD
		const newMovie = await prisma.movies.create({
			data: {
				imdb_code: movie.imdb_code,
				title: movie.title,
				year: movie.year,
				rating: movie.rating,
				runtime: movie.runtime,
				genres: tabToString(movie.genres),
				summary: movie.summary,
				language: movie.langage,
				background_image: movie.image.poster
			}
		})
	}
	catch {
		;
	}
}