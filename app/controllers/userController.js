const models = require('../models');
const bcrypt = require('bcrypt');

const userController = {


    loginSubmit: async (req, res) => {

            // Checking if user already exist
            const user = await models.User.findOne({
                where: {
                    email: req.body.email
                }
            });

            if(!user) {
                console.log('utilisateur inconnu');
                res.status(404).json({error: `User not found`});
            } else {
                // Checking password with bcrypt
                const validPwd = bcrypt.compareSync(req.body.password, user.psw);

                if(!validPwd) {
                    console.log('Erreur de mot de passe');
                    res.status(404).json({error: `Password not found`});
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

                    // Sending user datas in json to save it in sessionStorage => front/src/user.js
                    delete user.dataValues.hit_point;
                    delete user.dataValues.psw;
                    delete user.dataValues.createdAt;
                    delete user.dataValues.updatedAt

                    res.json(user);
                }
            }

    },

    logOut: (req, res) => {
        req.session.user = false;
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

    userHasDecks: async function() {

        const decks = await models.Deck.findAll({
            include: [{
                association: "userHasDecks",
                include: ["deckHasMonster", "deckHasBooster"]
            }],
            where: {
                user_id: req.body.id
            }
        })

        if (decks > 0) {
            res.status(200).json({message: "ok"});
        } else {
            res.status(404).json({error: "List not found"});
        }
        
    }
};

module.exports= userController;
