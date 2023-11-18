export type Movie = {
    title: string
    thumbnail: string
    year: number
    length: number
    imdbRating?: number
	source: 'EZTV' | 'YTS'
}
