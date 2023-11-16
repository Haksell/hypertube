import express, { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { getMe } from '../controllers/users'

const router: Router = express.Router()

router.get('/me', asyncHandler(getMe))

export default router
