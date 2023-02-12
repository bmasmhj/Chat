const database = require('../database/connection.js').database;

function add_chatbotmsg(uid, message, type) {
    
    database.query(`INSERT INTO chatbot_message (user_id , message , type ) VALUES ('${uid}' ,'${message}' , '${type}')`, function (error, results , fields) {
        if (error) throw error;
        return results
    });
}


module.exports = add_chatbotmsg;
