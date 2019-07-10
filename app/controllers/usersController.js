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

const listUsers = (req, res) => {
  const token =
    (req.body && req.body.access_token) ||
    (req.query && req.query.access_token) ||
    req.headers['x-access-token'];

  const { page } = req.query;
  const { limit } = req.query;

  if (token === undefined) {
    logger.info('The token was not given');
    return res.status(500).send('The token was not given');
  }

  return obtainAllUsers({ where: { email: jwt.verify(token, 'shhhhh').email } }).then(result => {
    if (result[0] === undefined) {
      logger.info('The user is not authenticated');
      return res.status(500).send('The user is not authenticated');
    }

    logger.info('The user is authenticated');

    return obtainAllUsers().then(result2 => {
      if (page === undefined || limit === undefined) {
        return res.status(200).send(result2[0]);
      }

      if (isNaN(page) || isNaN(limit) || page < 0 || limit <= 0) {
        return res.status(200).send('Invalid query value');
      }

      logger.info(result2.slice(limit * page, limit * (parseInt(page) + 1)));
      return res.status(200).send(result2.slice(limit * page, limit * (parseInt(page) + 1)));
    });
  });
};

module.exports = { addUser, signIn, listUsers };
