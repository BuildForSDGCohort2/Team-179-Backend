const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const config = require('../appconfigs/config')();

const sendMail = {};

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: config.smtp.server,
  port: config.smtp.port,
  secure: config.smtp.secure, // true for 465, false for other ports
  auth: {
    user: config.smtp.email, // generated ethereal user
    pass: config.smtp.password, // generated ethereal password
  },
});

// send mail with defined transport object
sendMail.send = (mailOptions) => {
  if (config.channel === 'smtp') {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return error;
      }
      return info;
    });
  }
  sgMail.setApiKey(config.sendgrid);
  return sgMail.send(mailOptions);
};
module.exports = sendMail;
