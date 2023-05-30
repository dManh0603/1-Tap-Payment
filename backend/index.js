const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const db = require('./config/db')
const route = require('./routers')
const chalk = require('chalk');
const ip = require("ip");

const app = express()

// Set the "public" folder as the static directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json())

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

dotenv.config()

db.connect()

route(app)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log('Server is running');
  console.log('On local: ' + chalk.blue(`127.0.0.1:${PORT}`))
  console.log('On your network: ' + chalk.blue(`${ip.address()}:${PORT}`))
})
