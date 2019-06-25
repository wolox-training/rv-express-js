const { User } = require('../models');

const registerUser = user => {
  User.create(user).catch(error => Promise.reject(error));
};

module.exports = { registerUser };
