const { registerUser } = require('../services/users');
const { encryptPassword, checkPassword } = require('../helpers/encryption');
const { obtainAllUsers } = require('../services/users');
const logger = require('../logger/index');

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

const signUp = (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  return obtainAllUsers({ where: { email } }).then(result => {
    // console.log(result[0]);
    console.log(password);
    if (result[0] === undefined) {
      console.log('email not registered');
      res.status(500).send(`The user ${email} ${password} was not found.`);
    } else {
      console.log('not undefined!!');
      if (checkPassword(password, result[0].password)) {
        console.log('authenticated!!');
        res.status(500).send(`The password for the user ${email} ${password} was right.`);
      } else {
        res.status(500).send(`The password for the user ${email} ${password} was wrong.`);
      }
    }
  });
};

module.exports = { addUser, signUp };
