import MainLayout from '../../layouts/MainLayout'
import { formatDuration } from '../../src/utilsTime'
import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'

const movie = {
    title: 'Night of the Living Dead',
    videoPath: '/dev_videos/oppenheimer.mp4',
    thumbnail: '/dev_thumbnails/night_of_the_living_dead_thumbnail.webp',
    header: '/dev_thumbnails/night_of_the_living_dead_header.webp',
    year: 1968,
    length: 96,
    imdbRating: 7.8,
    summary:
        'A ragtag group of survivors barricade themselves in an old farmhouse to remain safe from a horde of flesh-eating ghouls that are ravaging the Northeast portion of the United States.',
    producers: ['Russell Streiner', 'Karl Hardman'],
    directors: ['George A. Romero'],
    writers: ['John A. Russo', 'George A. Romero'],
    mainCast: ['Duane Jones', "Judith O'Dea", 'Karl Hardman', 'Marilyn Eastman'],
}

const Info: React.FC<{ title: string; content: string }> = ({ title, content }) =>
    content ? (
        <p className="mb-2">
            <span className="font-semibold">{title}:</span> {content}
        </p>
    ) : null

const pluralize = (name: string, arr: string[]) => (arr.length >= 2 ? name + 's' : name)

const MoviePage = () => {
    return (
        <MainLayout>
            <div className="container mx-auto space-y-3">
                <h1 className="text-4xl font-bold">{movie.title}</h1>
                <img
                    src={movie.header}
                    alt={movie.title}
                    className="w-1/2 h-auto transition-all duration-300 ease-in-out"
                />
                <img
                    src={movie.thumbnail}
                    alt={movie.title}
                    className="w-1/2 h-auto transition-all duration-300 ease-in-out"
                />
                <div className="aspect-video bg-black">
                    <iframe
                        className="w-full h-full border-none"
                        src={movie.videoPath}
                        allowFullScreen
                    />
                </div>
                <div className="text-gray-800">
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
            </div>
        </MainLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: {
      ...await serverSideTranslations(locale as string, ['common']),
    },
})

export default MoviePage