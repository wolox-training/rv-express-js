/* eslint-disable new-cap */

const {
  getAllAlbums,
  getAlbumById,
  getPhotosFromAlbum,
  getPhotoFromAlbumByIds
} = require('../services/albums');
const { statusCode } = require('../helpers/response');

const showAllAlbums = (req, res) => {
  getAllAlbums()
    .then(result => res.send(result.body))
    .catch(error =>
      res
        .status(statusCode['Internal Server Error'])
        .send({ error: `There were errors getting all the albums ${JSON.stringify(error)}` })
    );
};

const showAlbumById = (req, res) => {
  getAlbumById(req.params.id)
    .then(result => res.send(result.body))
    .catch(error =>
      res
        .status(statusCode['Internal Server Error'])
        .send({ error: `There were errors getting the album ${req.params.id} ${JSON.stringify(error)}` })
    );
};

const showPhotosFromAlbum = (req, res) => {
  getPhotosFromAlbum(req.params.id)
    .then(result => res.send(result.body))
    .catch(error =>
      res.status(statusCode['Internal Server Error']).send({
        error: `There were errors getting all the photos from the Album ${req.params.id} ${JSON.stringify(
          error
        )}`
      })
    );
};

const showPhotoFromAlbumByIds = (req, res) => {
  const { idPhoto, idAlbum } = req.params;
  getPhotoFromAlbumByIds(idAlbum, idPhoto)
    .then(result => res.send(result.body))
    .catch(error =>
      res.status(statusCode['Internal Server Error']).send({
        error: `There were errors getting the photo ${idPhoto} from the Album ${idAlbum} ${JSON.stringify(
          error
        )}`
      })
    );
};

module.exports = { showAllAlbums, showAlbumById, showPhotosFromAlbum, showPhotoFromAlbumByIds };
