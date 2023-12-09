import intializeDB from './db/init.ts'
import globalErrorMiddleware from './middleware/globalError.middleware.ts'
import requestLoggerMiddleware from './middleware/requestLogger.middleware.ts'
import webRoutes from './routes/web.ts'
import { json, urlencoded } from 'body-parser'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import { scheduleTask } from './utils/files-handling.ts'
import { oathToken } from './api/auth-api.ts'
import { authenticateJWT } from './api/middlewares/authJWT.ts'
import { getOneUser, getUsers, patchOneUser } from './api/users-api.ts'
import { createValidator } from 'express-joi-validation'
import { idShema, patchCommentSchema, patchUserSchema } from './api/joi-checks.ts'
import { apiGetMovies, apiGetOneMovie } from './api/movies-api.ts'
import { apiDeleteComment, apiGetComments, apiGetOneComment, apiPatchComment } from './api/comments-api.ts'

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
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
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


////////////////////ROUTES API////////////////////
const validator = createValidator()
app.post('/oauth/token', cors(corsOptionsAPI), oathToken) // POST oauth/token
app.get('/users', cors(corsOptionsAPI), authenticateJWT, getUsers) // GET /users
app.get('/users/:id', cors(corsOptionsAPI), authenticateJWT, getOneUser) // GET /users/:id
app.patch('/users/:id', cors(corsOptionsAPI), authenticateJWT, validator.body(patchUserSchema), validator.params(idShema), patchOneUser) // PATCH /users/:id
app.get('/movies', cors(corsOptionsAPI), apiGetMovies) // GET /movies
app.get('/movies/:id', cors(corsOptionsAPI), validator.params(idShema), apiGetOneMovie) // GET /movies/:id
app.get('/comments', cors(corsOptionsAPI), apiGetComments) // GET /comments
app.get('/comments/:id', cors(corsOptionsAPI), validator.params(idShema), apiGetOneComment) // GET /comments/:id
app.patch('/comments/:id', cors(corsOptionsAPI), authenticateJWT, validator.body(patchCommentSchema), validator.params(idShema), apiPatchComment) // PATCH /comments/:id
app.delete('/comments/:id', cors(corsOptionsAPI), authenticateJWT, validator.params(idShema), apiDeleteComment) // PATCH /comments/:id

// DELETE /comments/:id
// POST /comments OR POST /movies/:movie_id/comments


app.listen(port, () => console.log(`API listening on port ${port}!`))


var cron = require('node-cron');
cron.schedule('0 12 * * *', async () => { // every day of the week at 12:00   //cron.schedule('*/1 * * * *', async () => { // every minute
    console.log("CRON --- Update movies infos")
    await scheduleTask();
})