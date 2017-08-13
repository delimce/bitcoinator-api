'use strict';

var mail = require('nodemailer');
let mailConfig = require("../config/email.json");

let transporter = mail.createTransport(mailConfig.smtp);

let message = {
    from: mailConfig.defaultFromEmail,
    to: '', // comma separated list
    subject: '',
    text: '',
    html: ''
};


exports.setFrom = function (value) {
    message.from = value
}

exports.setTo = function (value) {
    message.to = value
}

exports.setSubject = function (value) {
    message.subject = value
}

exports.setContentText = function (value) {
    message.text = value
}

exports.setContentHtml = function (value) {
    message.html = value
}

exports.send = function () {

    transporter.sendMail(message, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email Sent: ' + info.response);
        }
    });

}



