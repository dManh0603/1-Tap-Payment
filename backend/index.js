const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const db = require('./config/db')
const route = require('./routers')

const app = express()

app.use(express.json())

dotenv.config()

db.connect()

route(app)

const PORT = process.env.PORT || 8080

app.listen(PORT, console.log(`Serser listening at port ${PORT}`))
