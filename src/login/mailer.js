const nodemailer = require('nodemailer'); 

const sendcode = (email, code) => {
    const transporter = nodemailer.createTransport({
        host: 'mail.bimash.com.np',
        port: 465,
        secure: true,
        auth: { user: 'noreply@bimash.com.np', pass: 'L9fWvqR@TMFUkVQ' }
    });
    transporter.sendMail({
        from: 'Chat App <noreply@bimash.com.np>',
        to: email,
        subject: 'Email Verification',
        text: `Your code is : ${code}`
    });

}
module.exports = {
   sendcode
}
