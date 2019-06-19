/* eslint-disable new-cap */

const {
  getAllAlbums,
  getAlbumById,
  getPhotosFromAlbum,
  getPhotoFromAlbumByIds
} = require('../services/albums');

const showAllAlbums = (req, res) => {
  getAllAlbums()
    .then(result => res.send(result.body))
    .catch(error =>
      res.status(500).send({ error: `There where errors getting albums ${JSON.stringify(error)}` })
    );
};

const showAlbumById = (req, res) => {
  getAlbumById(req.params)
    .then(result => res.send(result.body))
    .catch(error =>
      res.status(500).send({ error: `There were errors getting albums ${JSON.stringify(error)}` })
    );
};

const showPhotosFromAlbum = (req, res) => {
  getPhotosFromAlbum(req.params)
    .then(result => res.send(result.body))
    .catch(error =>
      res.status(500).send({ error: `There where errors getting albums ${JSON.stringify(error)}` })
    );
};

const showPhotoFromAlbumByIds = (req, res) => {
  const { idPhoto, idAlbum } = req.params;

  getPhotoFromAlbumByIds(idAlbum, idPhoto)
    .then(result => res.send(result.body))
    .catch(error =>
      res.status(500).send({ error: `There where errors getting albums ${JSON.stringify(error)}` })
    );
};

module.exports = { showAllAlbums, showAlbumById, showPhotosFromAlbum, showPhotoFromAlbumByIds };
