import { Request, Response } from 'express'

const jwt = require('jsonwebtoken');

export async function oathToken(req: Request, res: Response) {
	passport.authenticate('oauth2', { session: false }),
    (req: Request, res: Response) => {
        // Generate a JWT token upon successful authentication
        const token = jwt.sign({ user: req.user }, process.env.API_SECRET_KEY);
        res.json({ access_token: token });
    }
}

