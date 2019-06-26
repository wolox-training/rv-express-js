const { registerUser } = require('../services/users');
const logger = require('../logger/index');

// logger.info('hola');
// logger.error('hola');

const addUser = (req, res) => {
  const regexAlphanumeric = /^[a-zA-Z0-9]*$/;
  // eslint-disable-next-line no-useless-escape
  const regexValidEmail = /^([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)@wolox.com.ar$/;

  const { firstName, lastName, email } = req.body;
  let { password } = req.body;

  const bcrypt = require('bcryptjs');
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  if (password.length < 8) {
    res.status(500).send({ error: 'Password too short!' });
    logger.error('Password too short!');
    return;
  }

  if (regexAlphanumeric.test(password) === false) {
    res.status(500).send({ error: 'Password is not alphanumeric!' });
    logger.error('Password is not alphanumeric!');
    return;
  }

  password = hash;

  if (regexValidEmail.test(email) === false) {
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

module.exports = { addUser };
