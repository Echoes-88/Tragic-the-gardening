const express = require('express');
const mainController = require('./controllers/mainController');
const game = require('./controllers/game');

const router = express.Router();

router.get('/', mainController.home);

router.post('/', mainController.login);

router.get('/game', game.init);

router.use(mainController.error404);

module.exports = router;