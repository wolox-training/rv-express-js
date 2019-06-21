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
  getPhotoById(req.params.id)
    .then(result => res.send(result.body))
    .catch(error =>
      res
        .status(500)
        .send({ error: `There where errors getting the photo ${req.params.id} ${JSON.stringify(error)}` })
    );
};

module.exports = { showAllPhotos, showPhotoById };
