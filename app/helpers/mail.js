'use strict';
const logger = require('../logger/index');
const nodemailer = require('nodemailer');

const {
  AUTH_USER,
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,
  AUTH_REFRESH_TOKEN,
  AUTH_ACCESS_TOKEN
} = require('../../config/environment');

const sendMail = async useremail => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: AUTH_USER,
      clientId: AUTH_CLIENT_ID,
      clientSecret: AUTH_CLIENT_SECRET,
      refreshToken: AUTH_REFRESH_TOKEN,
      accessToken: AUTH_ACCESS_TOKEN
    }
  });

  const mailOptions = {
    from: 'Admin from WoloxTraining <welcome_email@wolox.com.ar>',
    to: useremail,
    subject: 'Welcome!!',
    text: 'Welcome to your new account!'
  };

  const result = await transporter.sendMail(mailOptions);

  logger.info(result);
  return `Message sent: <${result.accepted}@wolox.com.ar>`;
};

module.exports = { sendMail };
