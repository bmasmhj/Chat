const {database} = require('../database/connection.js');

const verify_user = async (req, res, next) => {
    const requests = req.body;
    // console.log(requests);
    const code = requests.code;
    const user_email = requests.access_email;
    try {
        database.query(`SELECT * FROM users WHERE access_email = '${user_email}'`, function (error, results , fields) {
            if (error) throw error;
            if (results.length > 0) {
                if (results[0].code ==  code ) {
                    database.query( `UPDATE users SET status = 1 , code = 0 WHERE uid= '${results[0].uid}' ` , function (error, rss , fss) {
                    if (error) throw error;
                    res.json({
                        'status': 'verified',
                        'user_id': results[0].uid,
                        'access_name': results[0].access_name,
                        'access_email': results[0].access_email,
                        'access_picture': results[0].access_picture,
                        'access_password': results[0].access_password,
                    });
                });
                }
                else {
                    res.json({ 'status': 'server_error' , 'message' : 'Something went wrong' });
                }
               
            }else{
                res.json({ 'status': 'unregistered', 'unregistered': user_email });
            }
        });
    } catch (err) {
        next(err);
    } 
}

module.exports = {
    verify_user
}