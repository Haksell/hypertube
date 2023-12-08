import { CustomError } from '../types_backend/movies'
import { getMovieByIMDB } from './bdd-movie'
import { open } from './bittorrent/torrent-parser'
import TorrentManager from './bittorrent/torrentManager'
import { File } from './bittorrent/types'
import { getSubtitles } from './subtitles'
import { Movies, PrismaClient } from '@prisma/client'
import axios from 'axios'
import path from 'path'

const prisma = new PrismaClient()

export async function downloadMovie(imdb_code: string) {
    //get movie
    var movie = await getMovieByIMDB(imdb_code)

    if (movie.status === 'DOWNLOADED') return //movie already downloaded

    if (movie.status === 'DOWNLOADING' && downloadStatus.get(imdb_code) !== undefined) {
        console.log('movie already downloading')
        return //movie already downloading
    }

    //get torrent info
    let torrents = await getTorrentInfo(imdb_code)

    //select torrent:
    let torrent = selectTorrent(torrents)

    //download movie
    await downloadTorrent(torrent, movie.id, imdb_code)

    //download subtitles
}

async function downloadSubtitle(imdb_code: string) {
    try {
        var movie = await getMovieByIMDB(imdb_code)
        console.log('start looking for subtitles, path=' + movie.folder)
        // console.log(movie)

        if (movie && movie.folder) await getSubtitles(movie.title, imdb_code, movie.folder)
        console.log('end looking for subtitles')
    } catch (error) {
        // if (error instanceof CustomError) res.status(400).send(`Invalid request: ${error.message}`)
        // else res.status(400).send('Sub not found')
    }
}

async function getTorrentInfo(imdb_code: string) {
    try {
        const response = await axios.get(`https://yts.mx/api/v2/movie_details.json`, {
            params: {
                imdb_id: imdb_code,
            },
        })
        if (response.data.status !== 'ok') throw new CustomError('Code not found')
        if (response.data.data.movie.imdb_code !== imdb_code)
            throw new CustomError('Code not found')

        const movie = response.data.data.movie
        const torrents = movie.torrents

        if (torrents.length === 0) throw new CustomError('No torrents available')

        return torrents
    } catch (error) {
        if (error instanceof CustomError) throw new CustomError(error.message)
        else throw new CustomError('API error')
    }
}

function selectTorrent(torrents: any) {
    let url: string = ''
    let seeds = 0

    for (const elem of torrents) {
        if (elem.seeds > seeds) {
            seeds = elem.seeds
            url = elem.url
        }
    }
    return url
}

export const downloadStatus = new Map<string, TorrentManager>()

let isStarting = false

export async function downloadTorrent(url: string, movieID: number, imdb_code: string) {
    if (isStarting) return
    isStarting = true
    var torrentStream = require('torrent-stream')

    console.log('url selected=' + url)

    if (downloadStatus.get(imdb_code) !== undefined) {
        console.log('movie already downloading 2')
        return //movie already downloading
    }
    const torrent = await open(url)
    console.log(torrent)
    const torrentManager = new TorrentManager(torrent)
    downloadStatus.set(imdb_code, torrentManager)
    isStarting = false

    torrentManager.on('ready', async (fileList: File[]) => {
        for (const file of fileList) {
            console.log(file)
            const filePath: string = path.basename(file.path)
            const folderPath: string = path.dirname(file.path)
            // TODO: handle different format webm / webp / mp4 / mkv ?
            if (file.path.endsWith('.mp4') || file.path.endsWith('.mkv')) {
                //sauvegarder nom bdd
                await prisma.movies.update({
                    where: {
                        id: movieID,
                    },
                    data: {
                        file: filePath,
                        folder: folderPath,
                        dateDownload: new Date(),
                        status: 'DOWNLOADING',
                    },
                })

                //look for subtitles
                await downloadSubtitle(imdb_code)
            }
        }
    })

    torrentManager.on('done', (success: boolean) => {
        prisma.movies.update({
            where: {
                id: movieID,
            },
            data: {
                status: success ? 'DOWNLOADED' : 'NOTDOWNLOADED',
            },
        })
    })

    torrentManager.start()
}
