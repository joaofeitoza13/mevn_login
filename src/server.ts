import express, { Express, Request, Response } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import { corsConfig, credentials, errorHandler } from './middleware'
import { connectDB } from './config'

dotenv.config()
const port = process.env.PORT!
// const database: string = process.env.LOCAL_DB
const database: string = process.env.REMOTE_DB!
const server: Express = express()

connectDB(database)

server.use(credentials)
server.use(cors<Request>(corsConfig))
server.use(errorHandler)

server.use(express.json())
server.use(express.urlencoded({ extended: false }))

server.use('/static', express.static(path.join(__dirname, 'public')))

server.get('/', (req: Request, res: Response) => {
  res.send("Typescript Express Server's root.")
})

server.all('*', (req: Request, res: Response) => {
  res.sendStatus(404)
})

mongoose.connection.once('open', () => {
  if(database === process.env.REMOTE_DB) {
    console.log(`Connected to MongoDB remotely.`)
  } else if (database === process.env.LOCAL_DB) {
    console.log(`Connected to MongoDB locally.`)
  }
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
})
