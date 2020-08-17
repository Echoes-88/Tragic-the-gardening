const Sequelize = require('sequelize');
const sequelize = require('../database');

class Booster extends Sequelize.model {};

Booster.init({

        name: Sequelize.STRING,
        text: Sequelize.STRING,
        type: Sequelize.STRING,
        effect_1: Sequelize.INTEGER,
        effect_2: Sequelize.INTEGER,
    }, {
        sequelize,
        tableName: "booster"
    });

module.exports = Booster;


