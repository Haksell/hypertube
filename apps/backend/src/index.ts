import intializeDB from './db/init.ts'
import auth from './middleware/auth.middleware.ts'
import globalErrorMiddleware from './middleware/globalError.middleware.ts'
import requestLoggerMiddleware from './middleware/requestLogger.middleware.ts'
import authRoutes from './routes/auth.ts'
import usersRoutes from './routes/users.ts'
import moviesRoutes from './routes/movies.ts'
import { json, urlencoded } from 'body-parser'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'

const port = process.env.PORT || 5001

intializeDB()

const app = express()

app.use(
    express.urlencoded(),
    cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }),
)
const cookieParser = require('cookie-parser')
app.use(cookieParser());
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(requestLoggerMiddleware)
app.get('/', (req, res) => res.send('API Root'))

app.use('/users', usersRoutes)
app.use('/movies', moviesRoutes)
app.use('/auth', authRoutes)


app.post('/test', auth, (req, res) => {
    res.status(200).send('Token Works - Yay!')
})

app.use(globalErrorMiddleware)

app.listen(port, () => console.log(`API listening on port ${port}!`))
