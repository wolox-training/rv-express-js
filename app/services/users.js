const { User } = require('../models');

const obtainAllUsers = parameters => User.findAll(parameters);
const registerUser = user => User.create(user);

module.exports = { registerUser, obtainAllUsers };
