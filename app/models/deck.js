const Sequelize = require('sequelize');
const sequelize = require('../database');

class Deck extends Sequelize.model {};

Deck.init({

        name: Sequelize.STRING,

    }, {
        sequelize,
        tableName: "deck"
    });

module.exports = Deck;


