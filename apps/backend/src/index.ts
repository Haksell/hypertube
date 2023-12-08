import intializeDB from './db/init.ts'
import auth from './middleware/auth.middleware.ts'
import globalErrorMiddleware from './middleware/globalError.middleware.ts'
import requestLoggerMiddleware from './middleware/requestLogger.middleware.ts'
import authRoutes from './routes/auth.ts'
import commentsRoutes from './routes/comments.ts'
import moviesRoutes from './routes/movies.ts'
import usersRoutes from './routes/users.ts'
import webRoutes from './routes/web.ts'
import { json, urlencoded } from 'body-parser'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import { scheduleTask } from './utils/files-handling.ts'
import { oathToken } from './api/auth-api.ts'


const cookieParser = require('cookie-parser')

const port = process.env.PORT || 5001

intializeDB()

const app = express()

const corsOptionsWeb = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

const corsOptionsAPI = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use((req, res, next) => {
    if (req.url.startsWith('/web')) {
        cors(corsOptionsWeb)(req, res, next);
    } else {
        next();
    }
});

app.use(urlencoded({ extended: true }));

app.use(cookieParser())
app.use(json())
app.use(requestLoggerMiddleware)
app.use(globalErrorMiddleware)

//ROUTE WEB
app.get('/', (req, res) => res.send('API Root'))
app.use('/web', webRoutes)

//ROUTES API
app.post('/oauth/token', cors(corsOptionsAPI), oathToken)

// POST oauth/token
// GET /users
// GET /users/:id
// PATCH /users/:id
// GET /movies
// GET /movies/:id
// GET /comments
// GET /comments/:id
// PATCH /comments/:id
// DELETE /comments/:id
// POST /comments OR POST /movies/:movie_id/comments


// app.use(
//     urlencoded({ extended: true }),
//     cors({
//         origin: 'http://localhost:3000',
//         methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//         allowedHeaders: ['Content-Type', 'Authorization'],
//         credentials: true,
//     }),
// )

// app.use('/users', usersRoutes)
// app.use('/movies', moviesRoutes)
// app.use('/auth', authRoutes)
// app.use('/comments', commentsRoutes)


app.listen(port, () => console.log(`API listening on port ${port}!`))


var cron = require('node-cron');
cron.schedule('0 12 * * *', async () => { // every day of the week at 12:00   //cron.schedule('*/1 * * * *', async () => { // every minute
    console.log("CRON --- Update movies infos")
    await scheduleTask();
})