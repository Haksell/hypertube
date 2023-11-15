import express from 'express';
import asyncHandler from "express-async-handler";
import { register, login } from "../controllers/auth";

const router = express.Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));

export default router;