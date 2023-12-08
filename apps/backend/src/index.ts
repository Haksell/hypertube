import intializeDB from './db/init.ts'
import auth from './middleware/auth.middleware.ts'
import globalErrorMiddleware from './middleware/globalError.middleware.ts'
import requestLoggerMiddleware from './middleware/requestLogger.middleware.ts'
import authRoutes from './routes/auth.ts'
import commentsRoutes from './routes/comments.ts'
import moviesRoutes from './routes/movies.ts'
import usersRoutes from './routes/users.ts'
import { json, urlencoded } from 'body-parser'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import { PrismaClient } from '@prisma/client'


const cookieParser = require('cookie-parser')
const path = require('path')

const port = process.env.PORT || 5001
var cron = require('node-cron');

const prisma = new PrismaClient()
const fs = require('fs').promises;

const removeMovieFolder = async (folder:string | null) => {
    const folderPath = path.join(folder);
  
    try {
        const folderExists = await fs.access(folderPath).then(() => true).catch(() => false);
    
        if (folderExists) {
            await fs.rm(folderPath, { recursive: true });
            console.log(`Removed folder for movie: ${folder}`);
        }
    } catch (error) {
        console.error(`Error removing folder for movie ${folder}:`, error);
    }
  };

const scheduleTask = async () => {
    try {
        const moviesToDelete = await prisma.movies.findMany({
            where: {
                dateDownload: {
                    lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
                    //lt: new Date(Date.now()), // every movies
                },
            },
        });

        for (const movie of moviesToDelete) {
            await removeMovieFolder(movie.folder);
            await prisma.movies.update({
                where: { id: movie.id},
                data: { file: null, dateDownload: null, folder: null },
            });
            console.log(`Removed file, dateDownload and folder movie with ID ${movie.imdb_code}`);
        }
    } catch (error) {
      console.error('Error executing cron job:', error);
    }
}

intializeDB()

const app = express()

app.use(
    urlencoded({ extended: true }),
    cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }),
)

// app.use('movies', express.static(path.join(__dirname, 'movies')));

app.use(cookieParser())
app.use(json())
app.use(requestLoggerMiddleware)
app.get('/', (req, res) => res.send('API Root'))

app.use('/users', usersRoutes)
app.use('/movies', moviesRoutes)
app.use('/auth', authRoutes)
app.use('/comments', commentsRoutes)

app.post('/test', auth, (req, res) => {
    res.status(200).send('Token Works - Yay!')
})

app.use(globalErrorMiddleware)

app.listen(port, () => console.log(`API listening on port ${port}!`))

//cron.schedule('*/1 * * * *', async () => { // every minute
cron.schedule('0 12 * * *', async () => { // every day of the week at 12:00
    console.log("CRON --- Update movies infos")
    await scheduleTask();
})