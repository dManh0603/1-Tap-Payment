const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const db = require('./config/db')
const route = require('./routers')
const chalk = require('chalk');
const handlebars = require('express-handlebars');
const ip = require("ip");
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express()

// Configure the session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Set the "public" folder as the static directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
// Parse JSON-encoded bodies
app.use(express.json())

// Set HBS as the view engine
app.engine('hbs', handlebars.engine({
  extname: '.hbs',
  // helpers: require('./helpers/HbsHelper'),
}));

app.set('view engine', 'hbs');
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
