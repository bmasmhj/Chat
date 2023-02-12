const { database } = require('../database/connection.js');
const { sendcode } = require('./mailer.js');
var bcrypt = require('bcryptjs');


const signup = async (req, res) => {
    const requests = req.body;
    const access_email = requests.access_email;
    var salt = await bcrypt.genSaltSync(10);
    const access_pass = await bcrypt.hashSync(requests.pass, salt);
    try {
        database.query(`SELECT * FROM users WHERE access_email = '${access_email}' `, function (error, results , fields) {
            if (error) throw error;
            const user_res = results;
            if(results.length > 0 ){
                // console.log(user_res[0].status);
                res.json({ 'status' : 'registered' , 'email' : access_email , 'acc_status' : user_res[0].status })
            }else{
                    var code = generateOTP(5);
                    var uid = guid();
                    const access_name = requests.access_name;
                    var rand = Math.floor(Math.random()*9) + 1;
                    database.query(`INSERT INTO users(uid, access_name, access_email, access_password, access_picture, source, status,code) 
                                    VALUES ('${uid}','${access_name}','${access_email}','${access_pass}','https://chat.bimash.com.np/assets/images/default${rand}.jpg','self','0','${code}')`, function (error, results, fields) {
                    if (error) throw error;
                    sendcode(access_email , code)
                    res.json({ 'status': 'new_registration', 'verification' : 'required' });
                });
            }
        });
    } catch (err) {
        next(err);
    } 
}

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateOTP(length) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

let guid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}


module.exports = {signup}