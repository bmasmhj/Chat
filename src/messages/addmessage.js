const database = require('../database/connection.js').database;

function addmessage(uid , message , now_time){
    database.query(`INSERT INTO message (uid , text , created_at ) VALUES ('${uid}' ,'${message}' , '${now_time}')`, function (error, results , fields) {
        if (error) throw error;
        return results
    });
}

module.exports = addmessage;
