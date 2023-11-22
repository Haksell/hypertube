import { formatDuration } from '../../src/utilsTime'
import NavBar from '../../components/NavBar'
import React, { useEffect, useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetServerSideProps } from 'next'
import RatingStars from '../../components/elems/RatingStars';
import { MovieCrew, MovieActor, MovieImage } from '../../src/shared/movies'
import { useTranslation } from 'next-i18next'
import axios from 'axios'
import {MovieDetails} from '../../src/shared/movies'
import { useRouter } from 'next/router'

const Info: React.FC<{ title: string; content: string }> = ({ title, content }) =>
    content ? (
        <p className="pb-2">
            <span className="font-semibold text-xs sm:text-lg">{title}:</span> {content}
        </p>
    ) : null

const pluralize = (name: string, arr: MovieCrew[]) => (arr.length >= 2 ? name + 's' : name)

function MoviePage() {
	const [movie, setMovieDetails] = useState<MovieDetails | null>(null)
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

    const searchInCrew = (job: string[]): MovieCrew[] => {
        if (!movie || !movie.crews) {
            return [];
        }
        return movie.crews.filter(crew => job.includes(crew.job as string));
    };
    const directors = searchInCrew(['Director']);
    const writers = searchInCrew(['Story', 'Writer']);
    const producers = searchInCrew(['Producer']);

    return !movie ? (
        <p>PAS DE FILM</p> /* Faudra changer :D */
    ) : (
        <div>
            <NavBar />
            <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden -z-10">
                <img
                    src={movie.image.background || '/defaultBackground.jpg'}
                    alt={movie.title}
                    className="object-cover w-full h-full top-10 brightness-50"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src = '/defaultBackground.jpg';
                    }}
                />
            </div>
            <div className="h-[22vh]"/>
            <div className="relative">
                <img
                    src={movie.image.poster || '/errorPicture.jpg'}
                    alt={movie.title}
                    className="absolute w-1/4 top-4 z-10 left-[3%] rounded-lg invisible shadow-lg shadow-orange-50 min-[770px]:visible min-[1000px]:-top-20"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src = '/errorPicture.jpg';
                    }}
                />
                <div className="flex flex-row pl-10 bg-neutral-800 w-full h-28 bg-opacity-80 min-[770px]:pl-[31vw]">
                    <div className="w-full">
                        <h1 className="py-2 pr-5 text-2xl font-bold text-slate-200 truncate sm:text-4xl">
                            {movie.title}
                        </h1>
                        <RatingStars rating={movie.rating / 2} />
                        {movie.genres.slice(0, 4).map((element, index) => (
                            <span key={index} className="mr-2 bg-blue-50 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {element}
                            </span>
                        ))}
                    </div>
                    <div className="flex flex-row-reverse w-full">
                        <button className="mr-[10%]">
                            <svg className="w-6 h-6 text-slate-200 hover:text-red-500 hover:duration-300 ease-in" fill="currentColor" viewBox="2 2 27 28">
                                <path d="M26.996 12.898c-.064-2.207-1.084-4.021-2.527-5.13-1.856-1.428-4.415-1.69-6.542-.132-.702.516-1.359 1.23-1.927 2.168-.568-.938-1.224-1.652-1.927-2.167-2.127-1.559-4.685-1.297-6.542.132-1.444 1.109-2.463 2.923-2.527 5.13-.035 1.172.145 2.48.788 3.803 1.01 2.077 5.755 6.695 10.171 10.683l.035.038.002-.002.002.002.036-.038c4.415-3.987 9.159-8.605 10.17-10.683.644-1.323.822-2.632.788-3.804z"></path>
                            </svg>
                        </button>
                        <button className="mr-10">
                            <svg className="w-6 h-6 text-slate-200 hover:text-blue-50 hover:duration-300 ease-in" fill="currentColor" viewBox="0 0 23 23">
                                <path d="M19 4v1h-2V3H7v2H5V3H3v18h2v-2h2v2h10v-2h2v2h2V3h-2v1zM5 7h2v2H5V7zm0 4h2v2H5v-2zm0 6v-2h2v2H5zm12 0v-2h2v2h-2zm2-4h-2v-2h2v2zm-2-4V7h2v2h-2z"></path>
                            </svg>
                        </button>
                        <button className="mr-10">
                            <svg className="w-5 h-5 text-slate-200 hover:text-orange-50 hover:duration-300 ease-in" fill="currentColor" viewBox="0 0 13 16">
                                <path d="M0 0V16l13-8Z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-neutral-900">
                <div className="text-slate-200 px-10 min-[770px]:pl-[31vw]">
                    <div className='py-3 w-auto flex flex-row items-center'>
                        <svg className="w-6 h-6 text-orange-50" viewBox="0 0 24 24" fill="none">
                            <path d="M3 9H21M7 3V5M17 3V5M6 12H8M11 12H13M16 12H18M6 15H8M11 15H13M16 15H18M6 18H8M11 18H13M16 18H18M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="currentColor" strokeWidth="2"></path>
                        </svg>
                        <p className='ml-2 mr-4 text-slate-200'>{movie.year.toString()}</p>
                        <svg className="w-6 h-6 text-blue-50" viewBox="0 0 24 24" fill="none">
                            <path d="M12 7V12L14.5 10.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"></path>
                        </svg>
                        <p className='ml-2 text-slate-200'>{formatDuration(movie.runtime)}</p>
                    </div>
                    <div className="flex flex-row items-center w-full">
                        <span className="mr-4 text-3xl font-extrabold">Summary</span>
                        <hr className="mt-2 w-full h-px bg-gray-200 border-0 dark:bg-gray-700"/>
                    </div>
                    <p className="pt-3 text-xl tracking-wide">{movie.summary}</p>
                    <div className="pt-4 flex flex-row items-center w-full">
                        <span className="mr-4 text-3xl font-extrabold">Casting</span>
                        <hr className="mt-2 w-full h-px bg-gray-200 border-0 dark:bg-gray-700"/>
                    </div>
                    <div className='flex overflow-x-auto m-6 pt-18'>
                        <div className='relative pl-5 flex flex-none mr-5 border-2 border-gray-700'>
                            <p className='absolute px-1 left-0 text-3xl font-bold text-orange-50 bg-gray-700 rounded-br bg-opacity-80'>{pluralize('Director', directors)}</p>
                            {directors.map((element, index) => (
                                <div key={index} className='my-5 mr-5'>
                                    <img
                                        src={element.image || '/errorPicture.jpg'}
                                        alt={element.name + index}
                                        className='w-[10vw]'
                                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                            e.currentTarget.src = '/errorPicture.jpg';
                                        }}
                                    />
                                    <p className='absolute bottom-0 right-2 rounded-t w-[90%] text-md bg-gray-700 bg-opacity-80 text-center'>{element.name}</p>
                                </div>
                            ))}
                        </div>
                        <div className='relative pl-5 flex flex-none mr-5 border-2 border-gray-700'>
                            <p className='absolute px-1 left-0 text-3xl font-bold text-orange-50 bg-gray-700 rounded-br bg-opacity-80'>{pluralize('Writer', writers)}</p>
                            {writers.map((element, index) => (
                                <div key={index} className='my-5 mr-5'>
                                    <img
                                        key={index}
                                        src={element.image || '/errorPicture.jpg'}
                                        alt={element.name + index}
                                        className='w-[10vw]'
                                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                            e.currentTarget.src = '/errorPicture.jpg';
                                        }}
                                    />
                                    <p className='absolute bottom-0 right-2 rounded-t w-[90%] text-md bg-gray-700 bg-opacity-80 text-center'>{element.name}</p>
                                </div>
                            ))}
                        </div>
                        <div className='relative pl-5 flex flex-none mr-5 border-2 border-gray-700'>
                            <p className='absolute px-1 left-0 text-3xl font-bold text-orange-50 bg-gray-700 rounded-br bg-opacity-80'>{pluralize('Producer', producers)}</p>
                            {producers.map((element, index) => (
                                <div key={index} className='my-5 mr-5'>
                                    <img
                                        key={index}
                                        src={element.image || '/errorPicture.jpg'}
                                        alt={element.name + index}
                                        className='w-[10vw]'
                                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                            e.currentTarget.src = '/errorPicture.jpg';
                                        }}
                                    />
                                    <p className='absolute bottom-0 right-2 rounded-t w-[10vw] text-md bg-gray-700 bg-opacity-80 text-center'>{element.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Info
                        title={pluralize('Director', directors)}
                        content={directors.map(director => director.name).join(', ')}
                    />
                    <Info
                        title={pluralize('Writer', writers)}
                        content={writers.map(writers => writers.name).join(', ')}
                    />
                    <Info
                        title={pluralize('Producer', producers)}
                        content={producers.map(producers => producers.name).join(', ')}
                    />
                    <Info title="Main Cast" content={movie.actors.map(actors => actors.name).join(', ')} />
                </div>
                <div className="flex justify-center align-center aspect-video bg-black mt-[10vw] w-full h-full">
                    <iframe
                        className='w-[80%] h-full border-4 border-yellow-50'
                        src={`https://www.youtube.com/embed/${movie.yt_trailer_code}`}
                        title="YouTube video player" 
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