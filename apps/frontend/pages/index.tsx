import NavBar from '../components/NavBar'
import { formatDuration } from '../src/utilsTime'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Movie = {
    title: string
    thumbnail: string
    year: number
    length: number
    imdbRating?: number
}

const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <Link href={`/movie/${movie.title}`}>
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
        </Link>
    )
}

const MoviesPage = () => {
    const [movies, setMovies] = useState<Movie[]>([])

    const shouldFetchMovies = () =>
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight

    const fetchMovies = async () => {
        try {
            const response = await axios.get('http://localhost:5001/movies')
            setMovies((prevMovies) => [...prevMovies, ...response.data])
            if (shouldFetchMovies()) fetchMovies()
        } catch (error) {
            console.error('Error fetching movies:', error)
        }
    }

    useEffect(() => {
        fetchMovies()
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            if (shouldFetchMovies()) fetchMovies()
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="min-h-screen bg-black">
            <NavBar />
            <div className="text-white">
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-1 p-4">
                    {movies.map((movie, i) => (
                        <MovieCard key={i} movie={movie} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MoviesPage
