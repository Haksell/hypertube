import {  NextFunction, Request, Response } from "express";

const globalErrorMiddleware = (
	err: Error,
	req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	next: NextFunction
) => {
	console.error(err.stack);
	return res.status(500).send("Une erreur est survenue sur le serveur.");
};

export default globalErrorMiddleware;
