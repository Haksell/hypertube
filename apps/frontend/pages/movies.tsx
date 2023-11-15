import React, { useState } from 'react'
import NavBar from '../components/NavBar'

type Movie = {
	title: string
	thumbnail: string
	year: number
	length: number
	imdbRating?: number
}

let movies: Movie[] = [
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

movies = [
	...movies,
	...movies,
	...movies,
	...movies,
	...movies,
	...movies,
	...movies,
	...movies,
	...movies,
	...movies,
	...movies,
]

const formatDuration = (minutes: number) => {
	const hours = Math.floor(minutes / 60)
	const mins = minutes % 60
	return `${hours}:${mins}`
}

const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
	const [isHovered, setIsHovered] = useState(false)

	return (
		<div
			className="relative group overflow-hidden cursor-pointer"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<img
				src={movie.thumbnail}
				alt={movie.title}
				width={230}
				height={345}
				className={`w-full h-auto transition-all duration-300 ease-in-out ${
					isHovered ? 'opacity-50' : ''
				}`}
			/>
			{isHovered && (
				<div className="absolute inset-0 bg-black bg-opacity-75 text-white p-4 flex flex-col justify-end transition-opacity duration-300 ease-in-out">
					<h3 className="text-base md:text-lg lg:text-xl font-bold mb-2">
						{movie.title}
					</h3>
					{movie.imdbRating && (
						<div className="text-center text-sm">{movie.imdbRating} / 10</div>
					)}
					<div className="flex justify-between text-sm">
						<span>{movie.year}</span>
						<span>{formatDuration(movie.length)}</span>
					</div>
				</div>
			)}
		</div>
	)
}
const MoviesPage = () => {
	return (
		<div className="min-h-screen bg-black">
			<NavBar />
			<div className="text-white">
				<div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-1 p-4">
					{movies.map((movie) => (
						<MovieCard key={movie.title} movie={movie} />
					))}
				</div>
			</div>
		</div>
	)
}

export default MoviesPage
