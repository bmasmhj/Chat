const {database} = require('../database/connection.js');
var bcrypt = require('bcryptjs');

const loginuser = async (req, res, next) => {
    const requests = req.body;
    // console.log(requests);
    const access_pass= requests.pass
    const user_email = requests.email;
    try {
        database.query(`SELECT * FROM users WHERE access_email = '${user_email}'`, function (error, results , fields) {
            if (error) throw error;
            if (results.length > 0) {
                bcrypt.compare(access_pass, results[0].access_password, function(err, verify) {
                    if (verify) {
                        if (results[0].code != 0 && results[0].status!=1 ) {
                            res.json({ 'status': 'email_unverified' });
                        }
                        else if (results[0].status == 1 && results[0].code == 0) {
                        res.json({
                            'status': 'login_verified',
                            'user_id': results[0].uid,
                            'access_name': results[0].access_name,
                            'access_email': results[0].access_email,
                            'access_picture': results[0].access_picture,
                            'access_password': results[0].access_password,
                         });
                        } else {
                            res.json({ 'status': 'server_error' , 'message' : 'Something went wrong' });
                        }
                    }
                    else {
                        res.json({ 'status': 'password_incorrect' });
                    }
                });
            }else{
                res.json({ 'status': 'unregistered', 'unregistered': user_email });
            }
        });
    } catch (err) {
        next(err);
    } 
}

const login_user =  (req, res , next) => {
    const requests = req.body;
    // console.log(requests);

    const get_user = requests.get_user;
    var access_picture = requests.access_picture;

    const access_name = requests.access_name;
    const access_email = requests.access_email;
    
    const access_pass = requests.user_id;
    
    const user_id = requests.user_id;
    
    try {
        database.query(`SELECT * FROM users WHERE uid = ${user_id} OR access_email = '${access_email}'`, function (error, results , fields) {
            if (error) throw error;
            const user_res = JSON.stringify(results);
            if(results.length > 0 ){
                res.json({
                    'status': 'login_verified',
                    'user_id': results[0].uid,
                    'access_name': results[0].access_name,
                    'access_email': results[0].access_email,
                    'access_picture': results[0].access_picture,
                    'access_password': results[0].access_password,
                });
            } else {
                if (get_user == 'facebook') {
                    var rand = Math.floor(Math.random()*9) + 1;
                    access_picture = `https://chat.bimash.com.np/assets/images/default${rand}.jpg`;
                }
               database.query(`INSERT INTO users(uid, access_name, access_email, access_password, access_picture, source, status,code) 
                                    VALUES ('${user_id}','${access_name}','${access_email}','${access_pass}','${access_picture}','${get_user}','1','0')`, function (error, results, fields) {
                    if (error) throw error;
                    res.json({
                        'status': 'login_verified',
                        'user_id': user_id,
                        'access_name':access_name,
                        'access_email':access_email,
                        'access_picture':access_picture,
                        'access_password':access_pass,
                    });
               });
            }
        });
    } catch (err) {
        next(err);
    } 
}
module.exports = {
    loginuser,
    login_user
}