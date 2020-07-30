const dataMapper = require('../datamapper');

const game = require('./game');

const mainController = {

    home: (req, res) => {

        res.render('home', {

        });

    },

    login: (req, res) => {


    // ici une première validation ultra basique
    if (!req.body.username || !req.body.psw) {
        hasError = 'erreur de login';
        console.log('Mauvais couple identifiant mot de passe');
    }
    else {

        dataMapper.login(req.body.username, req.body.psw, (callback) => {



            if(callback === 'error') {

                res.render('home', {
                hasError: 404,
                });

            } else {

                res.render('welcome', {
                    user:callback
                });

            }
        })

    }

    
},

    error404: (req, res) => {
        res.status(404).send('Page non trouvée');
    }
};

module.exports = mainController;
