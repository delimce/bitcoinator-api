'use strict';


exports.send = function () {

    var mail = require('nodemailer');
    let mailConfig = require("../config/email.json");

    let transporter = mail.createTransport(mailConfig.Mailgun);

    let message = {
        from: 'YourServer ',
        to: 'delimce@gmail.com', // comma separated list
        subject: 'Subject Line',
        text: 'Text contents.',
        html: '<b>Text contents.</b>'
    };


    transporter.sendMail(message, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Sent: ' + info.response);
        }
    });

}


exports.hola  = function(){

    console.log("hola")
}


