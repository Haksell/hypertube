import React, { useState } from 'react'
import NavBar from '../components/NavBar'

type Film = {
	title: string
	thumbnail: string
	year: number
	length: number
}

let films: Film[] = [
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
	{
		title: "OSS 117: Le Caire, nid d'espions",
		thumbnail: '/dev_thumbnails/oss117.jpg',
		year: 2006,
		length: 99,
	},
]

films = [
	...films,
	...films,
	...films,
	...films,
	...films,
	...films,
	...films,
	...films,
	...films,
	...films,
	...films,
]

const FilmCard = ({ film }) => {
	const [isHovered, setIsHovered] = useState(false)

	return (
		<div
			className="relative group"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<img
				src={film.thumbnail}
				alt={film.title}
				width={230}
				height={345}
				className="w-full h-auto"
			/>
			{isHovered && (
				<div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
					<h3>{film.title}</h3>
					<p>{film.year}</p>
					<p>{`${film.length} min`}</p>
				</div>
			)}
		</div>
	)
}

const FilmsPage = () => {
	return (
		<div className="min-h-screen bg-black">
			<NavBar />
			<div className="text-white">
				<div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-1 p-4">
					{films.map((film) => (
						<FilmCard key={film.title} film={film} />
					))}
				</div>
			</div>
		</div>
	)
}

export default FilmsPage
