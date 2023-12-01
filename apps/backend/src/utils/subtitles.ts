import { Request } from 'express'
import { extractStr } from './get-movies'

export function extractLangageSub(req: Request): string {
	const { lang } = req.query
	const langage: string = extractStr(false, lang, 'langage', 'en') 
	return langage
}
