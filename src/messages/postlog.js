const {database} = require('../database/connection.js');

function postlog(value){
    database.query(`INSERT INTO activity_log (log) VALUES ('${value}')`, function (error, results , fields) {
        if (error) throw error;
        return results
    });
}

module.exports = postlog;
