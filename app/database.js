const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(process.env.PG_URL,{
    define: {
      timestamps: false
    },
});

module.exports = sequelize;