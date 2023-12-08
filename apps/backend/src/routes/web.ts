import express, { Router } from 'express'
import authRoutes from './auth.ts'
import commentsRoutes from './comments.ts'
import moviesRoutes from './movies.ts'
import usersRoutes from './users.ts'

const router: Router = express.Router()

console.log('cominmg here')
router.use('/users', usersRoutes)
router.use('/movies', moviesRoutes)
router.use('/auth', authRoutes)
router.use('/comments', commentsRoutes)

export default router