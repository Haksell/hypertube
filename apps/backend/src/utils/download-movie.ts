import axios from "axios";
import { CustomError } from "../types_backend/movies";
import { Movies, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function downloadMovie(movie: Movies) {
	//get torrent info
	let torrents = await getTorrentInfo(movie.imdb_code)

	//select torrent:
	let torrent = selectTorrent(torrents)

	//download movie
	await downloadTorrent(torrent, movie)
}

async function getTorrentInfo(imdb_code: string) {
	try {
		const response = await axios.get(`https://yts.mx/api/v2/movie_details.json`, 
			{
				params: {
					imdb_id: imdb_code
				}
		})
		// console.log(response.data)
		if (response.data.status !== 'ok') throw new CustomError('Code not found')
		if (response.data.data.movie.imdb_code !== imdb_code) throw new CustomError('Code not found')

		const movie = response.data.data.movie
		const torrents = movie.torrents
		console.log('retour torrents')
		console.log(torrents)

		if (torrents.length === 0) throw new CustomError('No torrents available')

		return torrents

	}
	catch (error) {
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
			break ;
		}
	}
	return hash
}

export async function downloadTorrent(hash: string, movie: Movies) {
	var torrentStream = require('torrent-stream');

	var engine =  torrentStream(`magnet:?xt=urn:btih:${hash}`, {
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
		]
	});

	engine.on('ready', function() {
		engine.files.forEach(async function(file: any) {
			console.log('filename:', file.name);
			console.log('full path:', `${engine.path}/${file.path}`);
			var stream = file.createReadStream();
			if (file && file.name.endsWith('.mp4')) {
				//sauvegarder nom bdd
				await prisma.movies.update({
					where: {
						id: movie.id
					},
					data: {
						file: `${engine.path}/${file.path}`
					}
				})
			}
			
			// stream is readable stream to containing the file content
		});
	});

	engine.on('idle', function () {
		engine.files.forEach(function(file: any) {
			console.log('finished filename:', file.name);
			if (file.name.endsWith('.srt')) {
				;
			}
		});
	});

}