require('dotenv').config();

const express = require('express');

const router = require('./router');

const server = express();

server.use( express.static(__dirname + '/../asset') );

server.set('view engine', 'ejs');
server.set('views',  __dirname + '/views');

server.use(express.urlencoded({ extended: true, }));

const expressSession = require('express-session');

server.use(expressSession({
  resave: true,
  saveUninitialized: true,
  secret: process.env.APP_SECRET,
  cookie: { // 
    secure: false, // mettre true si https
    maxAge: (1000*60*60)
  }
}));

server.use(router);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
