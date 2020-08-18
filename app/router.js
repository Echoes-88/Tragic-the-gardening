const express = require('express');
const deckController = require('./controllers/deckController');
const monsterController = require('./controllers/monsterController');
const boosterController = require('./controllers/boosterController');
const userController = require('./controllers/userController');

const router = express.Router();

// ROUTES POUR LES DECK
router.get('/deck', deckController.getAll);

// Generateur de deck initial
router.get('/deck/init', deckController.init);

// router.post('/deck', deckController.createOne);
// router.get('/deck/:id', deckController.getOne);
// router.patch('/deck/:id', deckController.updateOne);
// router.delete('/deck/:id', deckController.deleteOne);

// // ROUTES POUR LES MONSTERS
// router.get('/monster', monsterController.getAll);

// router.post('/monster', monsterController.createOne);
// router.get('/monster/:id', monsterController.getOne);
// router.patch('/monster/:id', monsterController.updateOne);
// router.delete('/monster/:id', monsterController.deleteOne);

// // ROUTES POUR LES BOOSTERS
// router.get('/booster', boosterController.getAll);

// router.post('/booster', boosterController.createOne);
// router.get('/booster/:id', boosterController.getOne);
// router.patch('/booster/:id', boosterController.updateOne);
// router.delete('/booster/:id', boosterController.deleteOne);

// // ROUTES POUR LES USERS
// router.get('/user', userController.getAll);

// router.post('/user', userController.createOne);
// router.get('/user/:id', userController.getOne);
// router.patch('/user/:id', userController.updateOne);
// router.delete('/user/:id', userController.deleteOne);

module.exports = router;