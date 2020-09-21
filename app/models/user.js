const Sequelize = require('sequelize');
const sequelize = require('../database');

class User extends Sequelize.Model {

    get fullname() {
        return this.firstname + ' ' + this.lastname;
    }

};

    User.init({

        firstname: Sequelize.STRING,
        lastname: Sequelize.STRING,
        pseudo: Sequelize.STRING,
        email: Sequelize.STRING,
        hit_point: Sequelize.INTEGER,
        victory: Sequelize.INTEGER,
        defeat: Sequelize.INTEGER,
        level: Sequelize.INTEGER,
        psw: Sequelize.STRING,
        role: Sequelize.STRING
    }, {
        sequelize,
        tableName: "user"
    });

module.exports = User;


