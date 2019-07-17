const jwt = require('jsonwebtoken');
const { secret } = require('../../config/constants');
const logger = require('../logger/index');
const { JWT_EXPIRATION_TIME } = require('../../config/environment');

const signToken = email => jwt.sign({ email }, secret, { expiresIn: parseInt(JWT_EXPIRATION_TIME) });

const verifyToken = token => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    logger.error(error);
    return 'error';
  }
};

module.exports = { signToken, verifyToken };
