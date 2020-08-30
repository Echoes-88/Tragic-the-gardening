const express = require('express');

// Middleware to avoid try/catch in controllers
const capture = require('./middlewares/capture')

const genericController = require('./controllers/genericController')

const renderController = require('./controllers/renderController');

const userController = require('./controllers/userController');

const deckController = require('./controllers/deckController');


const router = express.Router();

// PAGE D'ACCUEIL
router.get('/', renderController.home);

// LOGIN
router.get('/login', userController.loginForm);
router.post('/login', capture(userController.loginSubmit));

// SIGNUP
router.get('/signup', userController.signupForm);
router.post('/signup', capture(userController.signupSubmit));

// USER PROFIL
router.get('/profil', userController.profil);

// ROUTES GENERIQUES CRUD : DECK, MONSTER, BOOSTER, USER
router.get('/crud/:entity', capture(genericController.getAll));
router.get('/crud/:entity/:id', capture(genericController.getOne));
router.post('/crud/:entity', capture(genericController.createOne));
router.patch('/crud/:entity/:id', capture(genericController.updateOne));
router.delete('/crud/:entity/:id', capture(genericController.deleteOne));

// Generateur de deck initial
router.get('/newGame', renderController.newGame);

// ROUTE POUR CREER UN DECK

module.exports = router;