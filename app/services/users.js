const { User } = require('../models');

const registerUser = user => User.create(user);

module.exports = { registerUser };
