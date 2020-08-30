const models = require('../models');
const bcrypt = require('bcrypt');

const userController = {

    profil: (req, res) => {
        res.render('profil');
    },

    loginForm: (req, res) => {

        res.render('login');
    },

    loginSubmit: async (req, res) => {

        // Checking if user already exist
        const user = await models.User.findOne({
            where: {
                email: req.body.email
            }
        });

        if(!user) {
            res.render('login', {
                error: 'Utilisateur inconnu',
                field: req.body // if no, return form with the textcontent
            });
        } else {
            // Checking password with bcrypt
            const validPwd = bcrypt.compareSync(req.body.password, user.psw);

            if(!validPwd) {
                res.render('login', {
                    error: 'Erreur de mot de passe',
                    field: req.body // if wrong password, return to login with textcontent
                });
            } else {
                // if login ok, add user informations to session
                req.session.user = {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    pseudo: user.pseudo,
                    email: user.email,
                    role: user.role,
                    id: user.id
                };
                if(req.body.remember) {
                    req.session.cookie.expires = new Date(Date.now() + 3600000);
                }

                res.redirect('/');
            }
        }

    },

    logOut: (req, res) => {
        req.session.user = false;
        res.redirect('/');
    },

    signupForm: (req, res) => {
        res.render('signup', {});
    },

    signupSubmit: async (req, res) => {

        // Checking if user already exist
        const user = await models.User.findOne({
            where: {
                email: req.body.email
            }
        });

        if(user) {
            res.render('signup', {
                error: 'Un utilisateur existe déjà avec cet email',
                field: req.body // if yes, return form with the textcontent
            });
        } else {
            // Checking password & confirm password
            if(req.body.password !== req.body.passwordConfirm) {
                res.render('signup'), {
                    error: 'La confirmation du mot de passe est incorrecte',
                    fields: req.body
                }
            } else {
              // Creating bcrypt password
              const hashPwd = bcrypt.hashSync(req.body.password, 10);

              // Add user in database
              await models.User.create({
                  email: req.body.email,
                  psw: hashPwd,
                  pseudo: req.body.pseudo,
                  firstname: req.body.firstname,
                  lastname: req.body.lastname
              });
              // Redirection to login page after register
              res.redirect('/login');
            }
        }
    },
};

module.exports= userController;
