// variables d'environnement
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5050;

// Express
const express = require('express');
const app = express();

// autorisation de requêtes externes
var cors = require('cors');
app.use(cors());

// Fichiers static
// app.use(express.static('./public/'));
app.use(express.static('./asset'));

// Views EJS
app.use(express.static('public'));
// app.set('view engine', 'ejs');
// app.set('views', 'app/views');

// gestionnaire POST
app.use(express.urlencoded({extended: true}));

// gestion des sessions
const session = require('express-session');
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: process.env.APP_SECRET
}));

// middleware user
const userMiddleware = require('./app/middlewares/userMiddleware');
app.use(userMiddleware);

// router
const router = require('./app/router');
app.use(router);

// lancement du serveur
app.listen( PORT,  () => {
  console.log(`Listening on ${PORT}`);
});