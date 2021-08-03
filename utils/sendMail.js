"use strict";
const nodemailer = require("nodemailer");

// explicitly require dotenv and define path becuase of 'use strict'
require('dotenv').config({ path: '../.env' });

// async..await is not allowed in global scope, must use a wrapper
module.exports.send = async function (toAddress, subject, text, html) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER, //process.env.EMAIL_USER, // generated ethereal user
            pass: process.env.EMAIL_PASSWD //process.env.PASSWD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"the FlatspotGuide" <flatspotguide@gmail.com>', // sender address
        to: toAddress, // list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html body
    });

    //console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

// main().catch(console.error);
