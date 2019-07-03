const { registerUser } = require('../services/users');
const { encryptPassword } = require('../helpers/encryption');
const logger = require('../logger/index');

const addUser = (req, res) => {
  const user = req.body;

  user.password = encryptPassword(user.password);

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

module.exports = { addUser };
