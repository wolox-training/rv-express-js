/* eslint-disable curly */
/* eslint-disable no-extra-parens */
const { registerUser } = require('../services/users');
const { encryptPassword } = require('../helpers/encryption');
const { obtainAllUsers } = require('../services/users');
const logger = require('../logger/index');
const { signToken } = require('../helpers/token');

const addUser = (req, res) => {
  const { firstName, lastName, email } = req.body;
  let { password } = req.body;

  password = encryptPassword(password);

  const user = { firstName, lastName, email, password };

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
      res.status(500).send({
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
  return res.status(200).send({ auth: true, token });
};

const listUsers = async (req, res) => {
  const { page, limit } = req.query;

  const userList = await obtainAllUsers();

  if (!page || !limit) return res.status(200).send(userList[0]);

  if (isNaN(page) || isNaN(limit) || page < 0 || limit <= 0)
    return res.status(400).send('Invalid query value');

  logger.info(userList.slice(limit * page, limit * (parseInt(page) + 1)));
  return res.status(200).send(userList.slice(limit * page, limit * (parseInt(page) + 1)));
};

module.exports = { addUser, signIn, listUsers };
