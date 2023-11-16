import { Request, Response } from 'express'

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

export async function getMovies(req: Request, res: Response) {
    res.status(201).send(movies)
}
