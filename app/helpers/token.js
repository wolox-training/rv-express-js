const jwt = require('jsonwebtoken');

const secret = 'shhhhh';

const signToken = email =>
  jwt.sign(
    {
      email
    },
    secret
  );

const verifyToken = token => jwt.verify(token, 'shhhhh');

module.exports = { signToken, verifyToken };
