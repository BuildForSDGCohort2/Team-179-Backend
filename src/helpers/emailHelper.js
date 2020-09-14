const debug = require('debug')('app:emailHelper');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const Mailgen = require('mailgen');
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

// Configure mailgen by setting a theme and your product info
const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Agri-Vesty',
    link: 'http://localhost:4000/',
  },
});

// send mail with defined transport object
sendMail.send = async (mailOptions) => {
  if (config.channel === 'smtp') {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return error;
      }
      return info;
    });
  }
  sgMail.setApiKey(config.sendgrid);

  return sgMail.send(mailOptions).then(() => {
    // Celebrate
  })
    .catch((error) => {
    // Log friendly error
      debug(error);

      if (error.response) {
      // Extract error msg
        // eslint-disable-next-line no-unused-vars
        const { message, code, response } = error;

        // Extract response msg
        // eslint-disable-next-line no-unused-vars
        const { headers, body } = response;

        debug(body);
      }
    });
};

sendMail.signUpTemplate = (name, code) => {
  // Configure email content with the custom name and code
  const email = {
    body: {
      name: `${name}`,
      intro: 'Welcome to Agri-Vesty! We\'re very excited to have you on board.',
      action: {
        instructions: 'To get started with Agri-Vesty, please click here:',
        button: {
          color: '#22BC66',
          text: 'Confirm your account',
          link: `http://localhost:4000/confirm?code=${code}`,
        },
      },
      outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.',
    },
  };
  // Generate and return an HTML email with the provided contents
  return mailGenerator.generate(email);
};

module.exports = sendMail;
