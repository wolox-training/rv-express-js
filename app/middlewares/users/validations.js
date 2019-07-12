/* eslint-disable no-extra-parens */
const { validate } = require('../../validators/users');
const logger = require('../../logger/index');

const { obtainOneUser } = require('../../services/users');
const { verifyToken } = require('../../helpers/token');

const { isEmailValid } = require('../../validators/users');
const { checkPassword } = require('../../helpers/encryption');

const validation = (req, res, next) => {
  const user = req.body;
  const validationErrors = validate(user).errors;

  if (validationErrors.length) {
    logger.error(
      `The input user data: ${user.firstName} ${user.lastName} ${user.email} is not valid: ${validationErrors}`
    );
    return res.status(500).send({
      error: `The input user data: ${user.firstName} ${user.lastName} ${user.email} is not valid: ${validationErrors}`
    });
  }
  return next();
};

const isAuthenticated = async (req, res, next) => {
  const token =
    (req.body && req.body.access_token) ||
    (req.query && req.query.access_token) ||
    req.headers['x-access-token'];

  if (!token) {
    logger.info('The token was not given');
    return res.status(400).send('The token was not given');
  }

  const user = await obtainOneUser({ where: { email: verifyToken(token).email } });

  if (!user) {
    logger.info('The user is not authenticated');
    return res.status(500).send('The user is not authenticated');
  }

  logger.info('The user is authenticated');
  return next();
};

const isAuthenticatedAsAdmin = async (req, res, next) => {
  const token =
    (req.body && req.body.access_token) ||
    (req.query && req.query.access_token) ||
    req.headers['x-access-token'];

  if (!token) {
    logger.info('The token was not given');
    return res.status(400).send('The token was not given');
  }

  const user = await obtainOneUser({ where: { email: verifyToken(token).email } });

  if (!user) {
    logger.info('The user is not authenticated');
    return res.status(500).send('The user is not authenticated');
  }

  if (user.privilegeLevel !== 'admin') {
    logger.info(`The user ${user.firstName} ${user.lastName} is not authenticated as Admin`);
    return res.status(500).send(`The user ${user.firstName} ${user.lastName} is not authenticated as Admin`);
  }

  logger.info(`The user ${user.firstName} ${user.lastName} is authenticated as Admin`);
  return next();
};

const isInputValid = (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    logger.info('No input email!');
    return res.status(400).send('No input email!');
  }

  if (!password) {
    logger.info('No input password!');
    return res.status(400).send('No input password!');
  }

  if (!isEmailValid(email)) {
    logger.info(`The email: ${email} is not a valid WOLOX email.`);
    return res.status(400).send(`The email: ${email} is not a valid WOLOX email.`);
  }
  return next();
};

const isLoginValid = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await obtainOneUser({ where: { email } });

  if (!user) {
    logger.info(`The email: ${email} is not registered.`);
    return res.status(500).send(`The email: ${email} is not registered.`);
  }

  if (!checkPassword(password, user.password)) {
    logger.info(`The password for the user with the email: ${email} was wrong.`);
    return res.status(400).send(`The password for the user with the email: ${email} was wrong.`);
  }

  return next();
};

module.exports = { validation, isAuthenticated, isAuthenticatedAsAdmin, isInputValid, isLoginValid };
