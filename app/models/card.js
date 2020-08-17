const Sequelize = require('sequelize');
const sequelize = require('../database');

class Card extends Sequelize.model {};

    Card.init({

        name: Sequelize.STRING,
        text: Sequelize.STRING,
        attack: Sequelize.INTEGER,
        defense: Sequelize.INTEGER,
        hit_point: Sequelize.INTEGER,
        special: Sequelize.INTEGER,
    }, {
        sequelize,
        tableName: "card"
    });

module.exports = Card;


