import express from "express";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import "dotenv/config";
import intializeDB from "./db/init.ts";
import authRoutes from "./routes/auth.ts";
import auth from "./middleware/auth.middleware.ts";
import requestLoggerMiddleware from "./middleware/requestLogger.middleware.ts";
import globalErrorMiddleware from "./middleware/globalError.middleware.ts";

const port = process.env.PORT || 5001;

intializeDB();

const app = express();

app.use(
  express.urlencoded(),
  cors({
    origin: "http://localhost:3000",
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(requestLoggerMiddleware);
app.get("/", (req, res) => res.send("API Root"));

app.use("/auth", authRoutes);

app.post("/test", auth, (req, res) => {
  res.status(200).send("Token Works - Yay!");
});

app.use(globalErrorMiddleware);

app.listen(port, () => console.log(`API listening on port ${port}!`));
