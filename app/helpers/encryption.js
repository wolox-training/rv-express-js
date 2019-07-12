const bcrypt = require('bcryptjs');

const saltValue = 10;
const salt = bcrypt.genSaltSync(saltValue);

const encryptPassword = password => bcrypt.hashSync(password, salt);

const checkPassword = (plaintextPassword, hashedPassword) =>
  bcrypt.compareSync(plaintextPassword, hashedPassword);

module.exports = { encryptPassword, checkPassword };
