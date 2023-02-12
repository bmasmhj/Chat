const {database} = require('../database/connection.js');

const getmymessage = async (req, res, next) => {
    const requests = req.body;
    try {
        database.query(`SELECT message as text , type as msg_type FROM chatbot_message WHERE user_id = '${requests.userid}'`, function (error, results , fields) {
            if (error) throw error;
            if (results.length > 0) {
                res.json({"data" : results});
            }else{
                res.json({"data" : []});
            }
        });
    } catch (err) {
        next(err);
    } 
}

module.exports = {
    getmymessage
}


