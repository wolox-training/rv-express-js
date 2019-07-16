/* eslint-disable new-cap */

const { getAllPhotos, getPhotoById } = require('../services/photos');
const { statusCode } = require('../helpers/response');

const showAllPhotos = (req, res) => {
  getAllPhotos()
    .then(result => res.send(result.body))
    .catch(error =>
      res
        .status(statusCode['Internal Server Error'])
        .send({ error: `There were errors getting all the photos ${JSON.stringify(error)}` })
    );
};

const showPhotoById = (req, res) => {
  getPhotoById(req.params.id)
    .then(result => res.send(result.body))
    .catch(error =>
      res
        .status(statusCode['Internal Server Error'])
        .send({ error: `There were errors getting the photo ${req.params.id} ${JSON.stringify(error)}` })
    );
};

module.exports = { showAllPhotos, showPhotoById };
