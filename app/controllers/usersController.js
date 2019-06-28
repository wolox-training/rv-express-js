const { registerUser } = require('../services/users');
const { isUserValid } = require('../validators/users');
const logger = require('../logger/index');

const addUser = (req, res) => {
  const user = req.body;

  if (!isUserValid(user)) {
    res.status(500).send({ error: `User is not valid: ${user.status}` });
    logger.error(`User is not valid: ${user.status}`);
    return;
  }

  registerUser(user)
    .then(result => {
      res.send(`The user ${user.firstName} ${user.lastName} was successfully created.`);
      logger.info(
        `The user ${user.firstName} ${user.lastName} was successfully created ${JSON.stringify(result)}`
      );
    })
    .catch(error => {
      res.status(500).send({
        error: `There were errors when adding the user ${user.firstName} ${user.lastName}: ${JSON.stringify(
          error
        )}`
      });
      logger.error(
        `There were errors when adding the user ${user.firstName} ${user.lastName}: ${JSON.stringify(error)}`
      );
    });
};

module.exports = { addUser };
