const { validate } = require('../validators/users');
const logger = require('../logger/index');

const validation = (req, res, next) => {
  const user = req.body;
  const validationErrors = validate(user).errors;

  if (validationErrors.length) {
    logger.error(
      `The input user data: ${user.firstName} ${user.lastName} ${user.email} is not valid: ${validationErrors}`
    );
    return res.status(500).send({
      error: `The input user data: ${user.firstName} ${user.lastName} ${user.email} is not valid: ${validationErrors}`
    });
  }
  return next();
};

module.exports = { validation };
