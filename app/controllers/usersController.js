const { registerUser } = require('../services/users');

const addUser = (req, res) => {
  registerUser(req.body)
    .then(result => res.send(result.body))
    .catch(error =>
      res.status(500).send({ error: `There were errors getting all the photos ${JSON.stringify(error)}` })
    );
};

module.exports = { addUser };
