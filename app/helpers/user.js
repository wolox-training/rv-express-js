const { obtainOneUser } = require('../services/users');
const { verifyToken } = require('../helpers/token');

const getUserObjectByToken = async token => {
  const decodedToken = verifyToken(token);

  if (decodedToken === 'error') {
    return decodedToken;
  }

  const userObject = await obtainOneUser({ where: { email: decodedToken.email } });
  return userObject;
};

const getUserByToken = async token => {
  const userObject = await getUserObjectByToken(token);
  return userObject.dataValues;
};

module.exports = { getUserByToken, getUserObjectByToken };
