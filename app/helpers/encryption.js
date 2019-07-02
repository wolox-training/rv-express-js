const bcrypt = require('bcryptjs');

const saltValue = 10;
const salt = bcrypt.genSaltSync(saltValue);

const encryptPassword = password => bcrypt.hashSync(password, salt);

module.exports = { encryptPassword };
