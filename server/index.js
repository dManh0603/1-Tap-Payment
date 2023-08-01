const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const path = require('path')
const db = require('./config/db')
const route = require('./routers')
const chalk = require('chalk');
const ip = require("ip");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()
const loggerMiddleware = require('./middlewares/LoggerMiddleware')
const initSocketIO = require('./config/socketio')

// Using cors middleware
app.use(cors({
  origin: '*',
  method: ['POST, GET, PUT, DELETE']
}));

// Set the "public" folder as the static directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
// Parse JSON-encoded bodies
app.use(express.json())

// Use winston logger
app.use(loggerMiddleware);

db.connect();
db.config();

route(app)

const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
  console.log('Server is running');
  console.log('On local: ' + chalk.blue(`127.0.0.1:${PORT}`))
  console.log('On your network: ' + chalk.blue(`${ip.address()}:${PORT}`))
})

initSocketIO(server);