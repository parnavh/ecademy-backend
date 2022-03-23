import express from "express";

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import api from './api/index.js'
app.use('/api', api)

app.listen(6174)