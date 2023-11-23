import NavBar from '../components/NavBar'
import { formatDuration } from '../src/utilsTime'
import axios from 'axios'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'

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

const limit = 7

const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <Link href={`/movie/${movie.imdb_code}`}>
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
            if (yearRange) params['year'] = yearRange
            if (minGrade) params['minGrade'] = minGrade
            if (language) params['language'] = language
            if (sortBy) params['sortBy'] = sortBy
            else params['sortBy'] = 'seeds'
            const response = await axios.get('http://localhost:5001/movies', {
                params: params,
            })
            // let newMovies: Movie[] = movies.slice(0, offset)
            // newMovies = newMovies.concat(response.data)
            // newMovies = newMovies.filter((newMovie, index) => {
            // 	const isDuplicate = newMovies.findIndex(movie => movie.imdb_code === newMovie.imdb_code) !== index;
            // 	return !isDuplicate;
            //   });
            // setMovies(newMovies)

            setMovies((prevMovies) => [...prevMovies.slice(0, offset), ...response.data])
            setFetchCount(offset + response.data.length)
        } catch (error) {
            console.error('Error fetching movies:', error)
        }
    }

    useEffect(() => {
        if (shouldFetchMovies() && fetchCount != 0) fetchMovies()
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
                    <label>
                        <input
                            type="checkbox"
                            onChange={handleSwitch}
                            checked={type === 'tvShow'}
                            className="peer sr-only"
                        />
                        <div
                            className="flex absolute items-center z-20 transition-all flex-row peer-checked:flex-row-reverse"
                            style={{
                                width: document.getElementById('choice2')?.offsetWidth + 'px',
                                height: document.getElementById('choice2')?.offsetHeight + 'px',
                            }}
                        >
                            <div className="font-bold py-1 px-3 mx-[8px] rounded-full bg-gradient-to-r from-orange-50 to-blue-50 transition-all text-transparent">
                                {type === 'movie' ? t('index.movies') : t('index.tv')}
                            </div>
                        </div>
                        <div
                            id="choice2"
                            className="z-10 py-2 flex items-center gap-6 rounded-full px-5 font-bold border-slate-600 bg-slate-700 text-white"
                        >
                            <span className="z-30">{t('index.movies')}</span>
                            <span className="z-30">{t('index.tv')}</span>
                        </div>
                    </label>
                </div>
                <div className="flex justify-center items-center mt-4 px-5 w-full max-w-7xl">
                    <div className="mx-4 hidden sm:block">
                        <label>
                            <input
                                type="checkbox"
                                onChange={handleSwitch}
                                checked={type === 'tvShow'}
                                className="peer sr-only"
                            />
                            <div
                                className="flex absolute items-center z-20 transition-all flex-row peer-checked:flex-row-reverse"
                                style={{
                                    width: document.getElementById('choice')?.offsetWidth + 'px',
                                    height: document.getElementById('choice')?.offsetHeight + 'px',
                                }}
                            >
                                <div className="font-bold py-1 px-3 mx-[8px] rounded-full bg-gradient-to-r from-orange-50 to-blue-50 transition-all text-transparent">
                                    {type === 'movie' ? t('index.movies') : t('index.tv')}
                                </div>
                            </div>
                            <div
                                id="choice"
                                className="z-10 py-2 flex items-center gap-6 rounded-full px-5 font-bold border-slate-600 bg-slate-700 text-white"
                            >
                                <span className="z-30">{t('index.movies')}</span>
                                <span className="z-30">{t('index.tv')}</span>
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
                            { value: '', label: '-' },
                            { value: 'Action', label: t('index.genre.action') },
                            { value: 'Adventure', label: t('index.genre.adventure') },
                            { value: 'Animation', label: t('index.genre.animation') },
                            { value: 'Comedy', label: t('index.genre.comedy') },
                            { value: 'Crime', label: t('index.genre.crime') },
                            { value: 'Documentary', label: t('index.genre.documentary') },
                            { value: 'Drama', label: t('index.genre.drama') },
                            { value: 'Family', label: t('index.genre.family') },
                            { value: 'Fantasy', label: t('index.genre.fantasy') },
                            { value: 'History', label: t('index.genre.history') },
                            { value: 'Horror', label: t('index.genre.horror') },
                            { value: 'Music', label: t('index.genre.music') },
                            { value: 'Mystery', label: t('index.genre.mystery') },
                            { value: 'Romance', label: t('index.genre.romance') },
                            { value: 'Science-Fiction', label: t('index.genre.science-fiction') },
                            { value: 'Thriller', label: t('index.genre.thriller') },
                            { value: 'War', label: t('index.genre.war') },
                            { value: 'Western', label: t('index.genre.western') },
                        ]}
                    />
                    <Filter
                        id="year"
                        label={t('index.year')}
                        handleChange={setYearRange}
                        options={[
                            { value: '', label: '-' },
                            { value: '2024', label: '2024' },
                            { value: '2023', label: '2023' },
                            { value: '2022', label: '2022' },
                            { value: '2021', label: '2021' },
                            { value: '2020', label: '2020' },
                        ]}
                    />
                    <Filter
                        id="grade"
                        label={t('index.grade')}
                        handleChange={setMinGrade}
                        options={[
                            { value: '', label: '-' },
                            { value: '9', label: '9+' },
                            { value: '8', label: '8+' },
                        ]}
                    />
                    <Filter
                        id="sort"
                        label={t('index.sort.name')}
                        handleChange={setSortBy}
                        options={[
                            { value: 'seeds', label: t('index.sort.seeds') },
                            { value: 'rating', label: t('index.sort.rating') },
                            { value: 'year', label: t('index.sort.year') },
                            { value: 'title', label: t('index.sort.title') },
                            { value: 'peers', label: t('index.sort.peers') },
                            { value: 'download_count', label: t('index.sort.download_count') },
                            { value: 'like_count', label: t('index.sort.like_count') },
                            { value: 'date_added', label: t('index.sort.date_added') },
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
