const database = require('../database/connection.js').database;

function add_chatbotmsg(uid, message, type , now_time) {
    let addQuery = "INSERT INTO chatbot_message (user_id , message , type , created_at) VALUES (?,? , ? , ?)";
    let values = [uid , message , type , now_time]
    database.query(addQuery, values,  function (error, results , fields) {
        if (error) throw error;
        return results
    });
}


module.exports = add_chatbotmsg;
