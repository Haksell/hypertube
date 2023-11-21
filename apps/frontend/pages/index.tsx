import NavBar from '../components/NavBar'
import { formatDuration } from '../src/utilsTime'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

type Movie = {
    title: string
    thumbnail: string
    year: number
    length: number
    imdbRating?: number
	imdb_code: string
	langage: string
	genre: string[]
	seeds: number
	quality: string
	url: string
    source: 'EZTV' | 'YTS'
}

export const genres = [
    'Action',
    'Adventure',
    'Animation',
    'Comedy',
    'Crime',
    'Documentary',
    'Drama',
    'Family',
    'Fantasy',
    'History',
    'Horror',
    'Music',
    'Mystery',
    'Romance',
    'Science-Fiction',
    'TV Movie',
    'Thriller',
    'War',
    'Western',
]

export const movieParamSortBy = [
    'title',
    'year',
    'rating',
    'peers',
    'seeds',
    'download_count',
    'like_count',
    'date_added',
]

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
                <div>
                    <div className="flex justify-between text-sm">
                        <span>{movie.year}</span>
                        <span>{formatDuration(movie.length)}</span>
                    </div>
					<div className="flex justify-between text-sm">
                        <span>rating:{movie.imdbRating}</span>
						<span>seeds:{movie.seeds}</span>
                    </div>
                </div>
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
            <label htmlFor={id} className="block mb-2 font-bold text-white">
                {label}:
            </label>
            <select
                id={id}
                onChange={(e) => handleChange(e.target.value)}
                className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
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
    const [type, setType] = useState('movie')
    const [downloaded, setDownloaded] = useState('no')
    let isFetchingFromScroll = false
	const { t } = useTranslation('common')

    const shouldFetchMovies = () => {
        return (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 100
        )
    }

    const fetchMovies = async (offset: number = fetchCount, newType: string = type) => {
        try {
            const params = {
                offset: offset,
                limit: limit,
                downloaded,
            }
            if (search) params['search'] = search
            if (genre) params['genre'] = genre
            if (yearRange) params['yearRange'] = yearRange
            if (minGrade) params['minGrade'] = minGrade
            if (language) params['language'] = language
            if (sortBy) params['sortBy'] = sortBy
            else params['sortBy'] = 'seeds'
            const response = await axios.get('http://localhost:5001/movies', {
                params: params,
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

    const handleScroll = async () => {
        if (!isFetchingFromScroll) {
            isFetchingFromScroll = true
            if (shouldFetchMovies()) await fetchMovies()
            isFetchingFromScroll = false
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [fetchCount])

    const handleSwitch = () => {
        setTimeout(() => {
            const newType = type === 'movie' ? 'tvShow' : 'movie'
            setType(newType)
            fetchMovies(0, newType)
        }, 30)
    }

    return (
        <div className="min-h-screen bg-black">
            <NavBar />
            <div className="flex flex-col w-full justify-center items-center">
                <div className="sm:hidden mr-4 mt-4">
                    <label className="relative inline-flex cursor-pointer items-center">
                        <input
                            type="checkbox"
                            onChange={handleSwitch}
                            checked={type === 'tvShow'}
                            className="peer sr-only"
                        />
                        <div className="z-20 absolute font-bold h-8 w-[70px] left-[5px] rounded-full bg-gradient-to-r from-orange-50 to-blue-50 transition-all peer-checked:left-[72px] peer-checked:w-[83px] text-white flex justify-center items-center">
                            {type === 'movie' ? t('index.movies') : t('index.tv')}
                        </div>
                        <div className="z-10 py-2 flex items-center gap-4 rounded-full px-3  border-slate-600 bg-slate-700 text-white">
                            <span className="z-30">{t('index.movies')}</span>
                            <span className="z-30">{t('index.tv')}</span>
                        </div>
                    </label>
                </div>
                <div className="flex justify-center items-center mt-4 px-5 w-full max-w-7xl">
                    <div className="hidden sm:block mr-4">
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                onChange={handleSwitch}
                                checked={type === 'tvShow'}
                                className="peer sr-only"
                            />
                            <div className="z-20 absolute font-bold h-8 w-[70px] left-[5px] rounded-full bg-gradient-to-r from-orange-50 to-blue-50 transition-all peer-checked:left-[72px] peer-checked:w-[83px] text-white flex justify-center items-center">
                                {type === 'movie' ? 'Movies' : 'TV Shows'}
                            </div>
                            <div className="z-10 py-2 flex items-center gap-4 rounded-full px-3  border-slate-600 bg-slate-700 text-white">
                                <span className="z-30">Movies</span>
                                <span className="z-30">TV Shows</span>
                            </div>
                        </label>
                    </div>
                    <div className="grow relative">
                        <input
                            type="text"
                            className="bg-gradient-to-r focus:bg-gradient-to-l from-orange-50 via-slate-400 to-blue-50 text-white font-medium py-2 pl-4 pr-10 rounded-full w-full placeholder-white focus:outline-none"
                            placeholder={t('index.searchMovies')}
                            onChange={(e) => setSearch(e.target.value)}
                            aria-label="Search movies"
                        />
                        <FaSearch className="absolute top-0 right-0 mt-3 mr-3 text-white" />
                    </div>

                    <button
                        className="hidden sm:block bg-gray-700 text-white font-bold py-2 px-8 rounded-full ml-2 hover:bg-gradient-to-r hover:from-orange-50 hover:to-blue-50"
                        onClick={() => fetchMovies(0)}
                    >
                        {t('index.search')}
                    </button>
                </div>
                <div className="flex flex-wrap justify-center items-center px-5 w-full max-w-7xl gap-4 mt-4">
                    <Filter
                        id="genre"
                        label={t('index.genre.name')}
                        handleChange={setGenre}
                        options={[
                            { value: 'drama', label: t('index.genre.drama') },
                            { value: 'action', label: t('index.genre.action') },
                        ]}
                    />
                    <Filter
                        id="year"
                        label={t('index.year')}
                        handleChange={setYearRange}
                        options={[
                            { value: '2022,2023', label: '2022 - now' },
                            { value: '2021,2022', label: '2021 - 2022' },
                        ]}
                    />
                    <Filter
                        id="grade"
                        label={t('index.grade')}
                        handleChange={setMinGrade}
                        options={[
                            { value: '9', label: '9+' },
                            { value: '8', label: '8+' },
                        ]}
                    />
                    <Filter
                        id="language"
                        label={t('index.lang.name')}
                        handleChange={setLanguage}
                        options={[
                            { value: 'english', label: t('index.lang.english') },
                            { value: 'french', label: t('index.lang.french') },
                        ]}
                    />
                    <Filter
                        id="sort"
                        label={t('index.sort.name')}
                        handleChange={setSortBy}
                        options={[
                            { value: 'rating', label: t('index.sort.rating') },
                            { value: 'year', label: t('index.sort.year') },
                        ]}
                    />
                    <Filter
                        id="downloaded"
                        label={t('index.availability.name')}
                        handleChange={setDownloaded}
                        options={[
                            { value: 'no', label: t('index.availability.all') },
                            { value: 'yes', label: t('index.availability.server') },
                        ]}
                    />
                </div>
                <div className="flex flex-wrap justify-center items-center mt-7 px-8">
                    <button
                        className="sm:hidden justify-center bg-gray-700 text-white font-bold py-2 px-8 rounded-full ml-2 hover:bg-gradient-to-r hover:from-orange-50 hover:to-blue-50"
                        onClick={() => fetchMovies(0)}
                        style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' }}
                    >
                        {t('index.search')}
                    </button>
                </div>
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

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}

export default MoviesPage
