import NavBar from '../components/NavBar'
import { formatDuration } from '../src/utilsTime'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'

type Movie = {
    title: string
    thumbnail: string
    year: number
    length: number
    imdbRating?: number
}

const limit = 7

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

type FilterProps = {
    id: string
    label: string
    handleChange: (value: string) => void
    options: { value: string; label: string }[]
}

const Filter: React.FC<FilterProps> = ({ id, label, handleChange, options }) => {
    return (
        <div className="relative w-52 mr-2">
            <label htmlFor={id} className="block mb-2 font-bold text-gray-900 dark:text-white">
                {label}:
            </label>
            <select
                id={id}
                onChange={(e) => handleChange(e.target.value)}
                className="border  text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            >
                {options.map((option: any) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

const MoviesPage = () => {
    const [movies, setMovies] = useState<Movie[]>([])
    const [fetchCount, setFetchCount] = useState(0)
    const [search, setSearch] = useState('')
    const [genre, setGenre] = useState('')
    const [yearRange, setYearRange] = useState('')
    const [minGrade, setMinGrade] = useState('')
    const [language, setLanguage] = useState('')
    const [sortBy, setSortBy] = useState('')

    const shouldFetchMovies = () => {
        return (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 100
        )
    }

    const fetchMovies = async (offset: number = fetchCount) => {
        try {
            const response = await axios.get('http://localhost:5001/movies', {
                params: {
                    offset,
                    limit,
                    search,
                    genre,
                    yearRange,
                    minGrade,
                    language,
                    sortBy,
                },
            })
            setMovies((prevMovies) => [...prevMovies.slice(0, offset), ...response.data])
            setFetchCount(offset + limit)
        } catch (error) {
            console.error('Error fetching movies:', error)
        }
    }

    useEffect(() => {
        if (shouldFetchMovies()) fetchMovies()
    }, [fetchCount])

    const handleScroll = () => {
        if (shouldFetchMovies()) fetchMovies()
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [fetchCount])

    return (
        <div className="min-h-screen bg-black">
            <NavBar />
            // A big button to search centered in the page
            <div className="flex justify-center items-center mt-4 px-5">
                <div className="relative w-full max-w-lg">
                    <input
                        type="text"
                        className="bg-gradient-to-r focus:bg-gradient-to-l from-orange-50 via-slate-400 to-blue-50 text-white font-medium py-2 pl-4 pr-10 rounded-full w-full placeholder-white focus:outline-none"
                        placeholder="Search movies by name..."
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Search movies"
                    />
                    <FaSearch className="absolute top-0 right-0 mt-3 mr-3 text-white" />
                </div>

                <button
                    className="hidden md:block my-button bg-gray-700 text-white font-bold py-2 px-8 rounded-full ml-2 hover:bg-gradient-to-r hover:from-orange-50 hover:to-blue-50"
                    onClick={() => fetchMovies(0)}
                >
                    Search
                </button>
            </div>
            <div className="flex flex-wrap justify-center items-center px-5 gap-2 mt-4">
                <Filter
                    id="genre"
                    label="Genre"
                    handleChange={setGenre}
                    options={[
                        { value: 'drama', label: 'Drama' },
                        { value: 'action', label: 'Action' },
                    ]}
                />
                <Filter
                    id="year"
                    label="Production Year"
                    handleChange={setYearRange}
                    options={[
                        { value: '2022,2023', label: '2022 - now' },
                        { value: '2021,2022', label: '2021 - 2022' },
                    ]}
                />
                <Filter
                    id="grade"
                    label="Grade"
                    handleChange={setMinGrade}
                    options={[
                        { value: '9', label: '9+' },
                        { value: '8', label: '8+' },
                    ]}
                />
                <Filter
                    id="language"
                    label="Language"
                    handleChange={setLanguage}
                    options={[
                        { value: 'english', label: 'English' },
                        { value: 'french', label: 'French' },
                    ]}
                />
                <Filter
                    id="sort"
                    label="Sort by"
                    handleChange={setSortBy}
                    options={[
                        { value: 'rating', label: 'Rating' },
                        { value: 'year', label: 'Year' },
                    ]}
                />
            </div>
            <div className="flex flex-wrap justify-center items-center mt-5">
                <button
                    className="md:hidden justify-center bg-gray-700 text-white font-bold py-2 px-8 rounded-full ml-2 hover:bg-gradient-to-r hover:from-orange-50 hover:to-blue-50"
                    onClick={() => fetchMovies(0)}
                >
                    Search
                </button>
            </div>
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
