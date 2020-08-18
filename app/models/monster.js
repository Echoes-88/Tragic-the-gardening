const Sequelize = require('sequelize');
const sequelize = require('../database');

class Monster extends Sequelize.Model {};

Monster.init({

        title: Sequelize.STRING,
        text: Sequelize.STRING,
        attack: Sequelize.INTEGER,
        defense: Sequelize.INTEGER,
        hit_point: Sequelize.INTEGER,
        special_effect_value: Sequelize.INTEGER,
        special_effect_value: Sequelize.INTEGER,
        position: Sequelize.INTEGER,
    }, {
        sequelize,
        tableName: "monster"
    });

module.exports = Monster;


