'use strict';

let mail = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const sgMail = require('@sendgrid/mail'); ///sendGrid

let mailConfig = require("../config/email.json");

///send by smtp
//let transporter = mail.createTransport(mailConfig.smtp);

let message = {
    from: mailConfig.defaultFromEmail,
    to: '', // comma separated list
    subject: '',
    text: '',
    html: ''
};


// Configure Nodemailer SendGrid Transporter
const transporter = mail.createTransport(
    sendgridTransport({
      auth: {
        api_key: mailConfig.sendgrid
      },
    })
  );


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
            console.log('Email Sent: ' + info);
        }
    });

}


