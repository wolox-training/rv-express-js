const { obtainOneUser } = require('../services/users');
const { verifyToken } = require('../helpers/token');

// eslint-disable-next-line require-await
const getUserObjectByToken = async token => {
  const decodedToken = verifyToken(token);
  // eslint-disable-next-line curly
  if (decodedToken === 'error') return decodedToken;

  return obtainOneUser({ where: { email: decodedToken.email } });
};

const getUserByToken = async token => {
  const userObject = await getUserObjectByToken(token);
  return userObject.dataValues;
};

module.exports = { getUserByToken, getUserObjectByToken };
