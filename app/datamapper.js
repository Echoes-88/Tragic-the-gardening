const db = require('./database');

const dataMapper = {

    login: (userName, psw, callback) => {

        db.query(`SELECT * FROM player WHERE pseudo=$1 AND psw=$2`, [userName, psw], (error, result) =>{



            if(result.rows[0] === undefined) {

                callback('error');
            } else {


                callback(result.rows[0]);

            }

        })

    }

}

module.exports = dataMapper; 