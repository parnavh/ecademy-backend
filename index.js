import express from "express";
import cors from 'cors'
import body_parser from "body-parser"
import dotenv from "dotenv"
dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

import api from './api/index.js'
app.use('/api', api)

app.listen(6174)