/* eslint-disable no-extra-parens */
const { validateEmailPassword, validateEmail } = require('../../validators/users');
const logger = require('../../logger/index');

const { obtainOneUser } = require('../../services/users');
const { verifyToken } = require('../../helpers/token');

const { checkPassword } = require('../../helpers/encryption');
const { statusCodes } = require('../../helpers/response');

const isUserDataPresent = (req, res, next) => {
  const user = req.body;

  if (!user.firstName) {
    logger.info('No input first name!');
    return res.status(statusCodes.bad_request).send('No input first name!');
  }

  if (!user.lastName) {
    logger.info('No input last name!');
    return res.status(statusCodes.bad_request).send('No input last name!');
  }
  return next();
};

const areCredentialsPresent = (req, res, next) => {
  const user = req.body;

  if (!user.email) {
    logger.info('No input email!');
    return res.status(statusCodes.bad_request).send('No input email!');
  }

  if (!user.password) {
    logger.info('No input password!');
    return res.status(statusCodes.bad_request).send('No input password!');
  }
  return next();
};

const isEmailValid = (req, res, next) => {
  const user = req.body;
  const validationErrors = validateEmail(user).errors;

  if (validationErrors.length) {
    logger.error(`${user.email} is not a valid WOLOX email: ${validationErrors}`);
    return res.status(statusCodes.bad_request).send({
      error: `${user.email} is not a valid WOLOX email: ${validationErrors}`
    });
  }
  return next();
};

const areCredentialsValid = (req, res, next) => {
  const user = req.body;
  const validationErrors = validateEmailPassword(user).errors;

  if (validationErrors.length) {
    logger.error(
      `The input user data: ${user.firstName} ${user.lastName} ${user.email} is not valid: ${validationErrors}`
    );
    return res.status(statusCodes.bad_request).send({
      error: `The input user data: ${user.firstName} ${user.lastName} ${user.email} is not valid: ${validationErrors}`
    });
  }
  return next();
};

const isLoginValid = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await obtainOneUser({ where: { email } });

  if (!user) {
    logger.info(`The email: ${email} is not registered.`);
    return res.status(statusCodes.unauthorized).send(`The email: ${email} is not registered.`);
  }

  if (!checkPassword(password, user.password)) {
    logger.info(`The password for the user with the email: ${email} was wrong.`);
    return res
      .status(statusCodes.unauthorized)
      .send(`The password for the user with the email: ${email} was wrong.`);
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
    return res.status(statusCodes.unauthorized).send('The token was not given');
  }

  const user = await obtainOneUser({ where: { email: verifyToken(token).email } });

  if (!user) {
    logger.info('The user is not authenticated');
    return res.status(statusCodes.unauthorized).send('The user is not authenticated');
  }

  logger.info('The user is authenticated');
  return next();
};

const isAuthenticatedAsAdmin = async (req, res, next) => {
  const token =
    (req.body && req.body.access_token) ||
    (req.query && req.query.access_token) ||
    req.headers['x-access-token'];

  const user = await obtainOneUser({ where: { email: verifyToken(token).email } });

  if (user.privilegeLevel !== 'admin') {
    logger.info(`The user ${user.firstName} ${user.lastName} is not authenticated as Admin`);
    return res
      .status(statusCodes.unauthorized)
      .send(`The user ${user.firstName} ${user.lastName} is not authenticated as Admin`);
  }

  logger.info(`The user ${user.firstName} ${user.lastName} is authenticated as Admin`);
  return next();
};

module.exports = {
  isUserDataPresent,
  areCredentialsPresent,
  areCredentialsValid,
  isEmailValid,
  isLoginValid,
  isAuthenticated,
  isAuthenticatedAsAdmin
};
