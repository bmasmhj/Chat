const nodemailer = require('nodemailer'); 

const sendcode = (email, code) => {
    const transporter = nodemailer.createTransport({
        host: 'MAIL_DOMAIN',
        port: PORT,
        secure: true,
        auth: { user: 'SOME_USERNAME', pass: 'SOME_PASSWORD' }
    });
    transporter.sendMail({
        from: 'Chat App <MAIL_DOMAIN>',
        to: email,
        subject: 'Email Verification',
        text: `Your code is : ${code}`
    });

}
module.exports = {
   sendcode
}
