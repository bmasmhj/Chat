const {database} = require('../database/connection.js');

const getmessage = (req, res, next) => {
    try {
    database.query(`SELECT message.id, message.uid, message.text, users.access_picture , users.access_name, users.access_email FROM message INNER JOIN users ON message.uid = users.uid ORDER BY id`, function (error, results , fields) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
    } catch (err) {
        next(err);
    }
};

const getuser = (req, res, next) => {
    try {
    database.query(`SELECT * FROM users`, function (error, results , fields) {
        if (error) throw error;
            res.send(JSON.stringify(results));
        });
    } catch (err) {
        next(err);
    }
};




module.exports = {
    getmessage,
    getuser
}


