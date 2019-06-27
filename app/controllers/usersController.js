const { registerUser, obtainAllUsers } = require('../services/users');
const { encryptPassword } = require('../helpers/encryption');
const { isPasswordAlphanumeric, isPasswordLenghtvalid, isEmailValid } = require('../validators/users');
const logger = require('../logger/index');

const addUser = (req, res) => {
  const { firstName, lastName, email } = req.body;
  let { password } = req.body;

  if (isPasswordLenghtvalid(password) === false) {
    res.status(500).send({ error: 'Password too short!' });
    logger.error('Password too short!');
    return;
  }

  if (isPasswordAlphanumeric(password) === false) {
    res.status(500).send({ error: 'Password is not alphanumeric!' });
    logger.error('Password is not alphanumeric!');
    return;
  }

  password = encryptPassword(password);

  if (isEmailValid(email) === false) {
    res.status(500).send({ error: 'Email not valid!' });
    logger.error('Email not valid!');
    return;
  }

  registerUser({ firstName, lastName, email, password })
    .then(result => {
      res.send(`The user ${firstName} ${lastName} was successfully created ${result.mybody}`);
      logger.info(`The user ${firstName} ${lastName} was successfully created ${result.mybody}`);
    })
    .catch(error => {
      res.status(500).send({
        error: `There were errors when adding the user ${firstName} ${lastName}: ${JSON.stringify(error)}`
      });
      logger.error(
        `There were errors when adding the user ${firstName} ${lastName}: ${JSON.stringify(error)}`
      );
    });
};

const getAllUsers = () => obtainAllUsers();

module.exports = { addUser, getAllUsers };
