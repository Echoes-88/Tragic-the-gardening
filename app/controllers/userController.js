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

            res.json({error: `userExist`, field: req.body});
            // field : return form with the textcontent

        } else {
            // Checking password & confirm password
            if(req.body.password !== req.body.passwordConfirm) {
                res.json({error: `wrongConfirm`, field: req.body});
                // field : return form with the textcontent
            } else {
              // Creating bcrypt password
              const hashPwd = bcrypt.hashSync(req.body.password, 10);

              // Add user in database
              const user = await models.User.create({
                  email: req.body.email,
                  psw: hashPwd,
                  pseudo: req.body.pseudo,
                  firstname: req.body.firstname,
                  lastname: req.body.lastname
              });

              // ADDING USER INFORMATIONS TO SESSION
              req.session.user = {
                firstname: user.firstname,
                lastname: user.lastname,
                pseudo: user.pseudo,
                email: user.email,
                role: user.role,
                id: user.id
            };

            delete user.dataValues.hit_point;
            delete user.dataValues.psw;
            delete user.dataValues.createdAt;
            delete user.dataValues.updatedAt

            res.json(user);

            }
        }
    },

    userHasDecks: async function(req, res) {

        const decks = await models.User.findAll({
            include: [{
                association: "userHasDecks",
                include: ["monsters", "boosters"]
            }],
            where: {
                id: req.params.id
            }
        })

        res.json(decks);


    }
};

module.exports= userController;
