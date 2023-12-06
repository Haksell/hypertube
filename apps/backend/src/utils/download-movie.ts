import { CustomError } from '../types_backend/movies'
import { getMovieByIMDB } from './bdd-movie'
import { getSubtitles } from './subtitles'
import { Movies, PrismaClient } from '@prisma/client'
import axios from 'axios'

const prisma = new PrismaClient()

export async function downloadMovie(imdb_code: string) {
    //get movie
    var movie = await getMovieByIMDB(imdb_code)

    if (movie.file) return //movie already downloaded

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
        // console.log(response.data)
        if (response.data.status !== 'ok') throw new CustomError('Code not found')
        if (response.data.data.movie.imdb_code !== imdb_code)
            throw new CustomError('Code not found')

        const movie = response.data.data.movie
        const torrents = movie.torrents
        console.log('retour torrents')
        console.log(torrents)

        if (torrents.length === 0) throw new CustomError('No torrents available')

        return torrents
    } catch (error) {
        if (error instanceof CustomError) throw new CustomError(error.message)
        else throw new CustomError('API error')
    }
}

function selectTorrent(torrents: any) {
    let hash = ''
    let seeds = 0

    console.log('torrents:')
    console.log(torrents)

    for (const elem of torrents) {
        if (elem.seeds > seeds) {
            seeds = elem.seeds
            hash = elem.hash
            break
        }
    }
    return hash
}

export async function downloadTorrent(hash: string, movieID: number, imdb_code: string) {
    var torrentStream = require('torrent-stream')

    console.log('hash selected=' + hash)

    var engine = torrentStream(`magnet:?xt=urn:btih:${hash}`, {
        path: `/tmp/nicoDL`,
        trackers: [
            'udp://open.demonii.com:1337/announce',
            'udp://tracker.openbittorrent.com:80',
            'udp://tracker.coppersurfer.tk:6969',
            'udp://glotorrents.pw:6969/announce',
            'udp://tracker.opentrackr.org:1337/announce',
            'udp://torrent.gresille.org:80/announce',
            'udp://p4p.arenabg.com:1337',
            'udp://tracker.leechers-paradise.org:6969',
        ],
    })

    engine.on('ready', function () {
        engine.files.forEach(async function (file: any) {
            console.log('filename:', file.name)
            console.log('full path:', `${engine.path} =/= ${file.path}`)
            const filePath: string = file.path.replace(`/${file.name}`, '')
            const folderPath: string = `${engine.path}/${filePath}`
            var stream = file.createReadStream()
            if (file && (file.name.endsWith('.mp4') || file.name.endsWith('.mkv'))) {
                //sauvegarder nom bdd
                await prisma.movies.update({
                    where: {
                        id: movieID,
                    },
                    data: {
                        file: `${file.name}`,
                        folder: folderPath,
                        dateDownload: new Date(),
                    },
                })

                //look for subtitles
                await downloadSubtitle(imdb_code)
            }

            // stream is readable stream to containing the file content
        })
    })

    engine.on('idle', function () {
        engine.files.forEach(function (file: any) {
            console.log('finished filename:', file.name)
            if (file.name.endsWith('.srt')) {
            }
        })
    })
}
