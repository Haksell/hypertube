import { register, login } from '../controllers/auth'
import express, { Router } from 'express'
import asyncHandler from 'express-async-handler'

const router: Router = express.Router()

router.post('/register', asyncHandler(register))
router.post('/login', asyncHandler(login))

export default router
