const jwt = require('jsonwebtoken');
const { secret } = require('../../config/constants');
const logger = require('../logger/index');

// const expirationTime = process.env.EXPIRATION_TIME;
const expirationTime = 15;

const signToken = email => jwt.sign({ email }, secret, { expiresIn: expirationTime });

const verifyToken = token => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    logger.error(error);
    return 'error';
  }
};

module.exports = { signToken, verifyToken };
