import express, { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { deleteImg, dowloadImg, getMe, uploadImg } from '../controllers/users'
import { imageFileFilter } from '../middleware/photo-middleware'
import verifyToken from '../middleware/auth.middleware'

const router: Router = express.Router()

router.get('/me', verifyToken, asyncHandler(getMe))

router.post('/image', verifyToken, asyncHandler(uploadImg));

router.get('/image/:filename', verifyToken, imageFileFilter, asyncHandler(dowloadImg));

router.delete('/image/:filename', verifyToken, imageFileFilter, asyncHandler(deleteImg));

export default router
