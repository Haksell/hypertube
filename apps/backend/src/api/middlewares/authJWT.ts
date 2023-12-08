import { Request, Response } from 'express'
const jwt = require('jsonwebtoken');

const authenticateJWT = (req: Request, res: Response, next: any) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.API_SECRET_KEY, (err: any, user: any) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};
