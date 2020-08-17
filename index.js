// variables d'environnement
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5050;

// Express
const express = require('express');

const app = express();

// views
app.set('views', 'app/views');
app.set('view engine', 'ejs');

// dossier statiques
app.use(express.static('asset'));

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
const userMiddleware = require('./app/middlewares/user');
app.use(userMiddleware);

// router
const router = require('./app/router');
app.use(router);

// lancement du serveur
app.listen( PORT,  () => {
  console.log(`Listening on ${PORT}`);
});