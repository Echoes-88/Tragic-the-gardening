const dataMapper = require('../datamapper');

const mainController = {

    home: (req, res) => {

        res.render('home', {
            titre: "Hello world",
        });

    },
    error404: (req, res) => {
        res.status(404).send('Page non trouvée');
    }
};

module.exports = mainController;
