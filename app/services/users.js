const { User } = require('../models');

const obtainAllUsers = () => User.findAll();
const registerUser = user => User.create(user);

module.exports = { registerUser, obtainAllUsers };
