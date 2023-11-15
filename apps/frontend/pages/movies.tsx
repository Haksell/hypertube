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

const FilmCard: React.FC<{ film: Film }> = ({ film }) => {
	const formatDuration = (minutes: number) => {
		const hours = Math.floor(minutes / 60)
		const mins = minutes % 60
		return `${hours}h ${mins}m`
	}

	return (
		<div className="max-w-sm rounded overflow-hidden shadow-lg">
			<img className="w-full" src={film.thumbnail} alt={`Thumbnail of ${film.title}`} />
			<div className="p-4">
				<div className="font-bold text-lg truncate mb-2">{film.title}</div>
				<div className="flex justify-between items-center">
					<span className="text-gray-600 text-sm">{film.year}</span>
					<span className="text-gray-600 text-sm">{formatDuration(film.length)}</span>
				</div>
			</div>
		</div>
	)
}

const FilmsPage = () => {
	return (
		<MainLayout>
			<div className="container mx-auto px-6">
				<h2 className="text-4xl font-bold my-8">Movies</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
					{films.map((film) => (
						<FilmCard key={film.title} film={film} />
					))}
				</div>
			</div>
		</MainLayout>
	)
}

export default FilmsPage
