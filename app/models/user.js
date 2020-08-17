const Sequelize = require('sequelize');
const sequelize = require('../database');

class User extends Sequelize.model {

    get fullname() {
        return this.firstname + ' ' + this.lastname;
    }

};

    User.init({

        firstname: Sequelize.STRING,
        lastname: Sequelize.STRING,
        nickname: Sequelize.STRING,
        email: Sequelize.STRING,
        hit_point: Sequelize.INTEGER,
        victory: Sequelize.INTEGER,
        defeat: Sequelize.INTEGER,
        psw: Sequelize.STRING,
    }, {
        sequelize,
        tableName: "user"
    });

module.exports = User;


