const database = require('../database/connection.js').database;

function addmessage(uid , message){
    database.query(`INSERT INTO message (uid , text ) VALUES ('${uid}' ,'${message}')`, function (error, results , fields) {
        if (error) throw error;
        return results
    });
}

module.exports = addmessage;
