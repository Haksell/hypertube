import { getMovies } from '../controllers/movies'
import express, { Router } from 'express'
import asyncHandler from 'express-async-handler'

const router: Router = express.Router()

router.get('/', asyncHandler(getMovies))

export default router
