/* eslint-disable new-cap */

const {
  getAllAlbums,
  getAlbumById,
  getPhotosFromAlbum,
  getPhotoFromAlbumByIds
} = require('../services/albums');

const showAllAlbums = (req, res) => {
  console.log('----/albums----');

  getAllAlbums()
    .then(result => res.send(result.body))
    .catch(error =>
      res.status(500).send({ error: `There where errors getting albums ${JSON.stringify(error)}` })
    );
};

const showAlbumById = (req, res) => {
  const { id } = req.params;
  console.log('\n\n----/albums by id number----');
  console.log(`Album Id: ${id}`);

  getAlbumById(id)
    .then(result => res.send(result.body))
    .catch(error =>
      res.status(500).send({ error: `There where errors getting albums ${JSON.stringify(error)}` })
    );
};

const showPhotosFromAlbum = (req, res) => {
  const { id } = req.params;

  console.log('----/photos from a certain album(specified by its Id)----');
  console.log(`Album Id: ${id}`);

  getPhotosFromAlbum(id)
    .then(result => res.send(result.body))
    .catch(error =>
      res.status(500).send({ error: `There where errors getting albums ${JSON.stringify(error)}` })
    );
};

const showPhotoFromAlbumByIds = (req, res) => {
  const { idPhoto, idAlbum } = req.params;

  console.log('----/Photo(specified by its Id) from a certain album(specified by its Id)----');
  console.log(`Album Id: ${idAlbum}`);
  console.log(`Photo Id: ${idPhoto}`);

  getPhotoFromAlbumByIds(idAlbum, idPhoto)
    .then(result => res.send(result.body))
    .catch(error =>
      res.status(500).send({ error: `There where errors getting albums ${JSON.stringify(error)}` })
    );
};

module.exports = { showAllAlbums, showAlbumById, showPhotosFromAlbum, showPhotoFromAlbumByIds };
