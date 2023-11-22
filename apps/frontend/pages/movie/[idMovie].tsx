import { formatDuration } from '../../src/utilsTime'
import NavBar from '../../components/NavBar'
import React, { useEffect, useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetServerSideProps } from 'next'
import RatingStars from '../../components/elems/RatingStars';
import { useTranslation } from 'next-i18next'
import axios from 'axios'
import {MovieDetails} from '../../src/shared/movies'
import { useRouter } from 'next/router'

const movie = {
    title: 'Night of the Living Dead',
    videoPath: '/dev_videos/oppenheimer.mp4',
    thumbnail: '/dev_thumbnails/night_of_the_living_dead_thumbnail.webp',
    header: '/dev_thumbnails/night_of_the_living_dead_header.webp',
    year: 1968,
    length: 96,
    imdbRating: 7.8,
    genres: ["Action", "Horror", "Thriller", "Test", "Test", "Test", "Test", "Test", "Test", "Test"],
    summary:
        'A ragtag group of survivors barricade themselves in an old farmhouse to remain safe from a horde of flesh-eating ghouls that are ravaging the Northeast portion of the United States.',
    producers: ['Russell Streiner', 'Karl Hardman'],
    directors: ['George A. Romero'],
    writers: ['John A. Russo', 'George A. Romero'],
    mainCast: ['Duane Jones', "Judith O'Dea", 'Karl Hardman', 'Marilyn Eastman'],
}

const Info: React.FC<{ title: string; content: string }> = ({ title, content }) =>
    content ? (
        <p className="pb-2">
            <span className="font-semibold text-xs sm:text-lg">{title}:</span> {content}
        </p>
    ) : null

const pluralize = (name: string, arr: string[]) => (arr.length >= 2 ? name + 's' : name)

function MoviePage() {
	const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null)
	const router = useRouter()
    const { idMovie } = router.query

	useEffect(() => {
		if (!idMovie) return
		if (idMovie !== '')
			getMovie()
	}, [idMovie])

	async function getMovie() {
		try {

			const response = await axios.get(`http://localhost:5001/movies/${idMovie}`)
			setMovieDetails(response.data)
			console.log(response.data)
		}
		catch {
			setMovieDetails(null)
		}
	}

    return (
        <div>
            <NavBar />
            <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden -z-10">
                <img
                    src={movie.header}
                    alt={movie.title}
                    className="object-cover w-full h-full top-10 brightness-50"
                />
            </div>
            <div className="h-[22vh]"/>
            <div className="relative">
                <img
                    src={movie.thumbnail}
                    alt={movie.title}
                    className="absolute w-1/4 top-4 z-10 left-[3%] rounded-lg invisible shadow-lg shadow-orange-50 min-[770px]:visible min-[1000px]:-top-20"
                />
                <div className="pl-10 bg-neutral-800 w-full h-28 bg-opacity-80 min-[770px]:pl-[31vw]">
                    <h1 className="py-2 text-2xl font-bold text-slate-200 truncate sm:text-4xl">
                        {movie.title}
                    </h1>
                    <RatingStars rating={movie.imdbRating / 2} />
                    {movie.genres.slice(0, 4).map((element, index) => (
                        <span key={index} className="mr-2 bg-blue-50 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {element}
                        </span>
                    ))}
                </div>
            </div>
            <div className="bg-neutral-950">
                <div className="text-slate-200 px-10 min-[770px]:pl-[31vw]">
                    <p className="pt-8 text-xl tracking-wide">{movie.summary}</p>
                    <hr className="h-px my-10 w-1/2 mx-auto bg-gray-200 border-0 dark:bg-gray-700"></hr>
                    <Info title="Year" content={movie.year.toString()} />
                    <Info title="Length" content={formatDuration(movie.length)} />
                    <Info title="IMDb Rating" content={movie.imdbRating.toString()} />
                    <Info title="Summary" content={movie.summary} />
                    <Info
                        title={pluralize('Director', movie.directors)}
                        content={movie.directors.join(', ')}
                    />
                    <Info
                        title={pluralize('Writer', movie.writers)}
                        content={movie.writers.join(', ')}
                    />
                    <Info
                        title={pluralize('Producer', movie.producers)}
                        content={movie.producers.join(', ')}
                    />
                    <Info title="Main Cast" content={movie.mainCast.join(', ')} />
                </div>
                <div className="aspect-video bg-black mt-[10vw]">
                    <iframe
                        className="w-full h-full border-none"
                        src={movie.videoPath}
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: {
      ...await serverSideTranslations(locale as string, ['common']),
    },
})

export default MoviePage