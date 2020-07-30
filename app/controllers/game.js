const dataMapper = require('../datamapper');

const game = {

    init: (req, res) => {

        res.render('game', {

        });

    },
    error404: (req, res) => {
        res.status(404).send('Page non trouvée');
    }
};

module.exports = game;
