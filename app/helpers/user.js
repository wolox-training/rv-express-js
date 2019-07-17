const { obtainOneUser } = require('../services/users');
const { verifyToken } = require('../helpers/token');

const getUserByToken = async token => {
  const userObject = await obtainOneUser({ where: { email: verifyToken(token).email } });
  return userObject.dataValues;
};

module.exports = { getUserByToken };
