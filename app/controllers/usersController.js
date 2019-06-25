const { registerUser } = require('../services/users');

const addUser = (req, res) => {
  const { body } = req;

  console.log(body.firstName);
  console.log(body.lastName);
  console.log(body.email);
  console.log(body.password);

  registerUser(body)
    .then(result => res.send(result.body))
    .catch(error =>
      res.status(500).send({ error: `There were errors when adding the user: ${JSON.stringify(error)}` })
    );
};

module.exports = { addUser };
