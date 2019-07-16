/* eslint-disable curly */
/* eslint-disable no-extra-parens */
const { registerUser } = require('../services/users');
const { encryptPassword } = require('../helpers/encryption');
const { obtainAllUsers, upsertOneUser } = require('../services/users');
const logger = require('../logger/index');
const { signToken } = require('../helpers/token');
const { statusCodes } = require('../helpers/response');

const addUser = (req, res) => {
  const { firstName, lastName, email } = req.body;
  let { password } = req.body;
  const privilegeLevel = 'normal';
  password = encryptPassword(password);

  const user = { firstName, lastName, email, password, privilegeLevel };

  return registerUser(user)
    .then(result => {
      logger.info(
        `The user ${user.firstName} ${user.lastName} was successfully created ${JSON.stringify(result)}`
      );
      res.send(`The user ${user.firstName} ${user.lastName} was successfully created.`);
    })
    .catch(error => {
      logger.error(
        `There were errors when adding the user ${user.firstName} ${user.lastName}: ${JSON.stringify(error)}`
      );
      res.status(statusCodes['Internal Server Error']).send({
        error: `There were errors when adding the user ${user.firstName} ${user.lastName}: ${JSON.stringify(
          error
        )}`
      });
    });
};

const signIn = (req, res) => {
  const { email } = req.body;

  const token = signToken(email);

  logger.info('Password OK, token sended.');
  return res.status(statusCodes.OK).send({ auth: true, token });
};

const listUsers = async (req, res) => {
  const { page, limit } = req.query;

  const userList = await obtainAllUsers();

  if (!page || !limit) return res.status(statusCodes.OK).send(userList[0]);

  if (isNaN(page) || isNaN(limit) || page < 0 || limit <= 0)
    return res.status(statusCodes['Bad Request']).send('Invalid query value');

  logger.info(userList.slice(limit * page, limit * (parseInt(page) + 1)));
  return res.status(statusCodes.OK).send(userList.slice(limit * page, limit * (parseInt(page) + 1)));
};

const addAdminUser = (req, res) => {
  const { firstName, lastName, email } = req.body;
  let { password } = req.body;
  const privilegeLevel = 'admin';
  password = encryptPassword(password);

  const user = { firstName, lastName, email, password, privilegeLevel };

  return upsertOneUser(user, { where: { email } })
    .then(result => {
      logger.info(
        `The user ${user.firstName} ${user.lastName} was successfully ${result ? 'created' : 'updated'} as ${
          user.privilegeLevel
        }`
      );
      res.send(
        `The user ${user.firstName} ${user.lastName} was successfully ${result ? 'created' : 'updated'} as ${
          user.privilegeLevel
        }`
      );
    })
    .catch(error => {
      logger.error(
        `There were errors when adding the user ${user.firstName} ${user.lastName}: ${JSON.stringify(error)}`
      );
      res.status(statusCodes['Internal Server Error']).send({
        error: `There were errors when adding the user ${user.firstName} ${user.lastName}: ${JSON.stringify(
          error
        )}`
      });
    });
};

module.exports = { addUser, signIn, listUsers, addAdminUser };
