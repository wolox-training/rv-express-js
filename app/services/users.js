const { User } = require('../models');

const obtainAllUsers = () => {
  User.findAll().then(results => results);
};

const registerUser = user => User.create(user);

module.exports = { registerUser, obtainAllUsers };
