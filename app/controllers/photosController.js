/* eslint-disable new-cap */

const { getAllPhotos, getPhotoById } = require('../services/photos');

const showAllPhotos = (req, res) => {
  getAllPhotos()
    .then(result => res.send(result.body))
    .catch(error =>
      res.status(500).send({ error: `There where errors getting photos ${JSON.stringify(error)}` })
    );
};

const showPhotoById = (req, res) => {
  const { id } = req.params;

  getPhotoById(id)
    .then(result => res.send(result.body))
    .catch(error =>
      res.status(500).send({ error: `There where errors getting photos ${JSON.stringify(error)}` })
    );
};

module.exports = { showAllPhotos, showPhotoById };
