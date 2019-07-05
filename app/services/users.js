const { User } = require('../models');

const obtainAllUsers = parameters => User.findAll(parameters);
const registerUser = user => User.create(user);
const cleanDB = () => User.destroy({ where: {}, force: true });

module.exports = { registerUser, obtainAllUsers, cleanDB };
