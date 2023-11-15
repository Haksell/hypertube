import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import "dotenv/config";
import auth from "./middleware.ts";
import intializeDB from "./db/init.ts";
import authRoutes from "./routes/auth.ts";
import requestLoggerMiddleware from "./middleware/requestLogger.middleware.ts";

const port = process.env.PORT || 5001;

intializeDB();

const app = express();

app.use(
  express.urlencoded(),
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(urlencoded({ extended: true }));
app.use(json());

app.get("/", (req, res) => res.send("API Root"));

app.use("/auth", authRoutes);

app.post("/test", auth, (req, res) => {
  res.status(200).send("Token Works - Yay!");
});

app.listen(port, () => console.log(`API listening on port ${port}!`));
