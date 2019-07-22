'use strict';
const logger = require('../logger/index');
const nodemailer = require('nodemailer');

const sendMail = async useremail => {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  const info = await transporter.sendMail({
    from: '"new users 👻" <new_users@wolox.com.ar>',
    to: useremail,
    subject: 'Welcome!!',
    text: 'Welcome to your new account!',
    html: '<b>Welcome to your new account!</b>'
  });

  logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  return `Message sent: ${info.messageId}`;
};

module.exports = { sendMail };
