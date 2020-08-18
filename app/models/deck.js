const Sequelize = require('sequelize');
const sequelize = require('../database');

class Deck extends Sequelize.Model {};

Deck.init({

        title: Sequelize.STRING,

    }, {
        sequelize,
        tableName: "deck"
    });

module.exports = Deck;


