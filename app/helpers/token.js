const jwt = require('jsonwebtoken');
const { secret } = require('../../config/constants');

const signToken = email =>
  jwt.sign(
    {
      email
    },
    secret
  );

const verifyToken = token => jwt.verify(token, secret);

module.exports = { signToken, verifyToken };
