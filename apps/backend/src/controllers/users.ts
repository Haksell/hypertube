import { Request, Response } from 'express'

type Movie = {
    title: string
    thumbnail: string
    year: number
    length: number
    imdbRating?: number
}

export async function getMe(req: Request, res: Response) {
    res.status(201).send('movies')
}
