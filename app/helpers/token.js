const jwt = require('jsonwebtoken');
const { secret } = require('../../config/constants');
const logger = require('../logger/index');

const { EXPIRATION_TIME } = process.env;

const signToken = email => jwt.sign({ email }, secret, { expiresIn: parseInt(EXPIRATION_TIME) });

const verifyToken = token => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    logger.error(error);
    return 'error';
  }
};

module.exports = { signToken, verifyToken };
