import { Request, Response } from 'express';
import express, { Router } from 'express';
import asyncHandler from "express-async-handler";
import { register, login, ConfirmEmail } from "../controllers/auth";
import { validateConfirmIdParam } from '../middleware/atuh.confirm-id.body.middleware';

const router: Router = express.Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));

router.get('/confirm/:confirmId', validateConfirmIdParam, (req: Request, res: Response) => {
	return ConfirmEmail(req, res);
})

export default router;
