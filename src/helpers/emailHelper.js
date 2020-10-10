const debug = require('debug')('app:emailHelper');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const Mailgen = require('mailgen');
const config = require('../appconfigs/config')();

const sendMail = {};

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
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
  try {
    if (config.channel === 'smtp') {
      const info = transporter.sendMail(mailOptions);
      return info;
    }
    debug(config.channel === 'smtp');
    sgMail.setApiKey(config.sendgrid);

    const sendGrindEmail = await sgMail.send(mailOptions);
    return sendGrindEmail;
  } catch (error) {
    // Log friendly error
    // debug(error);
    if (error.response) {
      // Extract error msg
      // eslint-disable-next-line no-unused-vars
      const { message, code, response } = error;

      // Extract response msg
      // eslint-disable-next-line no-unused-vars
      const { headers, body } = response;

      debug(body);
      return body;
    }
    return error;
  }
};

sendMail.signUpTemplate = (name, code) => {
  // Configure email content with the custom name and code
  const email = {
    body: {
      name: `${name}`,
      intro: 'Welcome to Agri-Vesty! We\'re very excited to have you on board.',
      action: {
        instructions: `
        Please click the button below to activate your new Agrivest account.
        If the account is not activated within 21 days, then all details will be deleted and you will not be contacted by Agrivesty.
        Else, enter this code: ${code}

        Regards,
        Agrivesty Support
        `,
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
sendMail.resetPassword = (name, code) => {
  // Configure email content with the custom name and code
  const email = {
    body: {
      name: `${name}`,
      intro: 'Thank you for using to Agri-Vesty! We\'re very excited to have you on board.',
      action: {
        instructions: `
        Please click the button below to reset your Agrivest account password.
        This password reset code is valid for 7 days.
        `,
        button: {
          color: '#22BC66',
          text: 'Confirm your account',
          link: `http://localhost:4000/confirm?code=${code}`,
        },
      },
      outro: `
      Else, enter this code: ${code}
      Need help, or have questions? Just reply to this email, we'd love to help.
      Regards,
      Agrivesty Support`,
    },
  };
  // Generate and return an HTML email with the provided contents
  return mailGenerator.generate(email);
};
sendMail.authTemplate = (name) => {
  // Configure email content with the custom name and code
  const email = {
    body: {
      name: `${name}`,
      intro: 'Welcome to Agri-Vesty! We\'re very excited to have you on board.',
      action: {
        instructions: 'To get started with Agri-Vesty, please click here:',
        button: {
          color: '#22BC66',
          text: 'Go to Agri-Vesty',
          link: `${config.serverUrl}`,
        },
      },
      outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.',
    },
  };
  // Generate and return an HTML email with the provided contents
  return mailGenerator.generate(email);
};
module.exports = sendMail;
