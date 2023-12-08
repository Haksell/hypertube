import { off } from 'process'
import UserNotSignedIn from '../components/auth/UserNotSignedIn'
import { MovieCard } from '../components/elems/MovieCard'
import MainLayout from '../layouts/MainLayout'
import { useUserContext } from '../src/context/UserContext'
import { MovieDTO } from '../src/shared/movies'
import { range } from '../src/utils'
import axios from 'axios'
import { TFunction, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'

const limit = 7
const DEFAULT_SORT_BY = 'like_count'

type VideoType = 'movie' | 'tvShow'

const MoviesTVShowOption: React.FC<{ isActive: boolean; text: string }> = ({ isActive, text }) => (
    <span
        className={`rounded-full py-1 px-3 select-none ${
            isActive && 'bg-gradient-to-r from-orange-50 to-blue-50'
        }`}
    >
        {text}
    </span>
)

const MoviesTVShowSwitch: React.FC<{ handleSwitch: () => void; type: string }> = ({
    handleSwitch,
    type,
}) => {
    const { t } = useTranslation('common')

    return (
        <label className="flex items-center rounded-full py-1 px-1 font-bold bg-slate-700 text-white">
            <input
                type="checkbox"
                onChange={handleSwitch}
                checked={type === 'tvShow'}
                className="sr-only"
            />
            <MoviesTVShowOption isActive={type === 'movie'} text={t('index.movies')} />
            <MoviesTVShowOption isActive={type !== 'movie'} text={t('index.tv')} />
        </label>
    )
}

const Filter: React.FC<{
    disabled: boolean
    handleChange: (value: string) => void
    id: string
    label: string
    options: { value: string; label: string }[]
}> = ({ disabled, handleChange, id, label, options }) => {
    return (
        <div className="relative w-52 mr-2">
            <label htmlFor={id} className="block mb-2 font-bold text-white">
                {label}:
            </label>
            <select
                id={id}
                onChange={(e) => handleChange(e.target.value)}
                className={`border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 ${
                    disabled && 'bg-neutral-800 border-neutral-800'
                }`}
                disabled={disabled}
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

const SearchButton: React.FC<{
    disabled: boolean
    handleSearch: any
    forSmallScreens: boolean
    t: TFunction
}> = ({ disabled, handleSearch, forSmallScreens, t }) => (
    <button
        className={`${
            forSmallScreens ? 'block sm:hidden' : 'hidden sm:block'
        } bg-gray-700 text-white font-bold py-2 px-8 rounded-full ml-2 ${
            disabled
                ? 'bg-neutral-800 cursor-not-allowed'
                : 'hover:bg-gradient-to-r hover:from-orange-50 hover:to-blue-50'
        }`}
        onClick={() => handleSearch()}
        disabled={disabled}
    >
        {t('index.search')}
    </button>
)

const MoviesPage = () => {
    const { user } = useUserContext()
    const [movies, setMovies] = useState<MovieDTO[]>([])
    const [fetchCount, setFetchCount] = useState(0)
    const [search, setSearch] = useState('')
    const [genre, setGenre] = useState('')
    const [yearRange, setYearRange] = useState('')
    const [minGrade, setMinGrade] = useState('')
    const [sortBy, setSortBy] = useState('')
    const [type, setType] = useState<VideoType>('movie')
    const [stopFetch, setStopFetch] = useState(false)
    const [downloaded, setDownloaded] = useState('no')
    let isFetchingFromScroll = false
    const { t } = useTranslation('common')

    const shouldFetchMovies = () => {
        return (
            !stopFetch && window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - window.innerHeight / 2
        )
    }

    const fetchMovies = async (offset: number = fetchCount, newType: string = type) => {
        try {
            const params: any = { offset, limit, downloaded }
            if (search) params['search'] = search
            if (genre) params['genre'] = genre
            if (yearRange) params['year'] = yearRange
            if (minGrade) params['minGrade'] = minGrade
            else params['sortBy'] = 'seeds'
            if (newType) params['type'] = newType
            params['sortBy'] = sortBy || DEFAULT_SORT_BY
            const response = await axios.get('http://localhost:5001/movies', {
                params: params,
                withCredentials: true,
            })
            if (response.data.length < 7)
                setStopFetch(true)
            setMovies((prevMovies) => [...prevMovies.slice(0, offset), ...response.data])
            setFetchCount(offset + response.data.length)
        } catch (error) {
            // console.error('Error fetching movies:', error)
        }
    }

    useEffect(() => {
        if (shouldFetchMovies()) void fetchMovies()
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
        const newType = type === 'movie' ? 'tvShow' : 'movie'
        setType(newType)
        setTimeout(() => {
            setStopFetch(false)
            void fetchMovies(0, newType)
        }, 30)
    }

    const handleSearch = () => {
        setStopFetch(false)
        void fetchMovies(0)
    }

    return !user ? (
        <UserNotSignedIn />
    ) : (
        <div className="min-h-screen bg-black">
            <MainLayout>
                <div
                    className="flex flex-col w-full justify-center items-center outline-none"
                    tabIndex={0}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') handleSearch()
                    }}
                >
                    <div className="sm:hidden mr-4 mt-4">
                        <MoviesTVShowSwitch type={type} handleSwitch={handleSwitch} />
                    </div>
                    <div className="flex justify-center items-center mt-4 px-5 w-full max-w-7xl">
                        <div className="mx-4 hidden sm:block">
                            <MoviesTVShowSwitch type={type} handleSwitch={handleSwitch} />
                        </div>
                        <div className="grow relative">
                            <input
                                type="text"
                                className={`font-medium py-2 pl-4 pr-10 rounded-full w-full placeholder-white focus:outline-none ${
                                    type === 'tvShow'
                                        ? 'bg-neutral-800 cursor-not-allowed'
                                        : 'bg-gradient-to-r focus:bg-gradient-to-l from-orange-50 via-slate-400 to-blue-50 text-white'
                                }`}
                                placeholder={type === 'movie' ? t('index.searchMovies') : ''}
                                onChange={(e) => setSearch(e.target.value)}
                                disabled={type === 'tvShow'}
                                aria-label="Search movies"
                            />
                            <FaSearch className="absolute top-0 right-0 mt-3 mr-3 text-white" />
                        </div>
                        <SearchButton
                            disabled={type === 'tvShow'}
                            handleSearch={handleSearch}
                            forSmallScreens={false}
                            t={t}
                        />
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
                                { value: 'Biography', label: t('index.genre.biography') },
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
                                { value: 'Science-Fiction', label: t('index.genre.sci-fi') },
                                { value: 'Thriller', label: t('index.genre.thriller') },
                                { value: 'War', label: t('index.genre.war') },
                                { value: 'Western', label: t('index.genre.western') },
                            ]}
                            disabled={type === 'tvShow'}
                        />
                        <Filter
                            id="year"
                            label={t('index.year')}
                            handleChange={setYearRange}
                            options={[
                                { value: '', label: '-' },
                                ...range(2024, 1900).map((y) => ({
                                    value: y.toString(),
                                    label: y.toString(),
                                })),
                            ]}
                            disabled={type === 'tvShow'}
                        />
                        <Filter
                            id="grade"
                            label={t('index.grade')}
                            handleChange={setMinGrade}
                            options={[
                                { value: '', label: '-' },
                                ...range(9, 1).map((r) => ({
                                    value: r.toString(),
                                    label: `${r}+`,
                                })),
                            ]}
                            disabled={type === 'tvShow'}
                        />
                        <Filter
                            id="sort"
                            label={t('index.sort.name')}
                            handleChange={setSortBy}
                            options={[
                                { value: 'like_count', label: t('index.sort.like_count') },
                                { value: 'seeds', label: t('index.sort.seeds') },
                                { value: 'rating', label: t('index.sort.rating') },
                                { value: 'year', label: t('index.sort.year') },
                                { value: 'title', label: t('index.sort.title') },
                                { value: 'peers', label: t('index.sort.peers') },
                                { value: 'download_count', label: t('index.sort.download_count') },
                                { value: 'date_added', label: t('index.sort.date_added') },
                            ]}
                            disabled={type === 'tvShow'}
                        />
                        <Filter
                            id="downloaded"
                            label={t('index.availability.name')}
                            handleChange={setDownloaded}
                            options={[
                                { value: 'no', label: t('index.availability.all') },
                                { value: 'yes', label: t('index.availability.server') },
                            ]}
                            disabled={type === 'tvShow'}
                        />
                    </div>
                    <div className="flex flex-wrap justify-center items-center mt-7 px-8">
                        <SearchButton
                            disabled={type === 'tvShow'}
                            handleSearch={handleSearch}
                            forSmallScreens={true}
                            t={t}
                        />
                    </div>
                </div>
                <div className="text-white">
                    <div className="grid grid-cols-1 min-[500px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-1 p-4">
                        {movies.map((movie, i) => (
                            <MovieCard key={i} movie={movie} />
                        ))}
                    </div>
                </div>
            </MainLayout>
        </div>
    )
}

export async function getStaticProps({ locale }: { locale: any }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}

export default MoviesPage
