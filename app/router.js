const express = require('express');
const mainController = require('./controllers/mainController');

const router = express.Router();

router.get('/', mainController.home);

router.use(mainController.error404);

module.exports = router;