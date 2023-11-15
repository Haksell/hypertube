import React from 'react'
import MainLayout from '../layouts/MainLayout'

type Film = {
    title: string
    thumbnail: string
    year: number
    length: number
}

const films: Film[] = [
    {
        title: 'Oppenheimer',
        thumbnail: '/dev_thumbnails/oppenheimer.jpg',
        year: 2023,
        length: 162,
    },
    {
        title: 'Rumble Through the Dark',
        thumbnail: '/dev_thumbnails/rumble_through_the_dark.jpg',
        year: 2023,
        length: 162,
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
]

const FilmCard = ({ film }) => {
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg">
            <img
                className="w-full"
                src={film.thumbnail}
                alt={`Thumbnail of ${film.title}`}
            />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">
                    {film.title} ({film.year})
                </div>
                {film.rating && (
                    <span className="block bg-green-200 text-green-800 text-sm px-2 py-1 rounded">
                        {film.rating} / 10
                    </span>
                )}
                {film.genre && (
                    <span className="block text-gray-700 text-base">
                        {film.genre}
                    </span>
                )}
                {film.length && (
                    <span className="block text-gray-600 text-sm">
                        {film.length} min
                    </span>
                )}
            </div>
        </div>
    )
}

const FilmsPage = () => {
    return (
        <MainLayout>
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold my-8">Popular Downloads</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {films.map((film) => (
                        <FilmCard key={film.title} film={film} />
                    ))}
                </div>
            </div>
        </MainLayout>
    )
}

export default FilmsPage
