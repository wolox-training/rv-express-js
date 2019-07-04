/* eslint-disable no-extra-parens */
const { registerUser } = require('../services/users');
const { encryptPassword, checkPassword } = require('../helpers/encryption');
const { obtainAllUsers } = require('../services/users');
const { isEmailValid } = require('../validators/users');
const logger = require('../logger/index');
const jwt = require('jsonwebtoken');

const addUser = (req, res) => {
  const { firstName, lastName, email } = req.body;
  let { password } = req.body;

  password = encryptPassword(password);

  const user = { firstName, lastName, email, password };

  return registerUser(user)
    .then(result => {
      logger.info(
        `The user ${user.firstName} ${user.lastName} was successfully created ${JSON.stringify(result)}`
      );
      res.send(`The user ${user.firstName} ${user.lastName} was successfully created.`);
    })
    .catch(error => {
      logger.error(
        `There were errors when adding the user ${user.firstName} ${user.lastName}: ${JSON.stringify(error)}`
      );
      res.status(500).send({
        error: `There were errors when adding the user ${user.firstName} ${user.lastName}: ${JSON.stringify(
          error
        )}`
      });
    });
};

const signIn = (req, res) => {
  const { email, password } = req.body;

  if (email === undefined) {
    logger.info('No input email!');
    return res.status(400).send('No input email!');
  }

  if (password === undefined) {
    logger.info('No input password!');
    return res.status(400).send('No input password!');
  }

  return obtainAllUsers({ where: { email } }).then(result => {
    if (!isEmailValid(email)) {
      logger.info(`The email: ${email} is not a valid WOLOX email.`);
      return res.status(200).send(`The email: ${email} is not a valid WOLOX email.`);
    }

    if (result[0] === undefined) {
      logger.info(`The email: ${email} is not registered.`);
      return res.status(500).send(`The email: ${email} is not registered.`);
    }

    if (!checkPassword(password, result[0].password)) {
      logger.info(`The password for the user with the email: ${email} was wrong.`);
      return res.status(200).send(`The password for the user with the email: ${email} was wrong.`);
    }

    const token = jwt.sign(
      {
        email
      },
      'shhhhh'
    );
    logger.info('Password OK, token sended.');
    return res.status(200).send({ auth: true, token });
  });
};

const me = (req, res) => {
  const token =
    (req.body && req.body.access_token) ||
    (req.query && req.query.access_token) ||
    req.headers['x-access-token'];

  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  }

  return jwt.verify(token, 'shhhhh', (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }

    return res.status(200).send(`Hola: ${JSON.stringify(decoded)}`);
  });
};

module.exports = { addUser, signIn, me };
