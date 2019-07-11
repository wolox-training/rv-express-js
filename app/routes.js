/* eslint-disable new-cap */

const express = require('express');
const {
  showAllAlbums,
  showAlbumById,
  showPhotosFromAlbum,
  showPhotoFromAlbumByIds
} = require('./controllers/albumsController');
const { showAllPhotos, showPhotoById } = require('./controllers/photosController');

const { addUser, signIn, listUsers } = require('./controllers/usersController');
const { validation, validateIsOnDBList, validateIsOnDBSignIn } = require('./middlewares/users/validations');

const { healthCheck } = require('./controllers/healthCheck');

const init = app => {
  app.get('/health', healthCheck);
};

const photosRouter = express.Router();

photosRouter.get('/', showAllPhotos);
photosRouter.get('/:id', showPhotoById);

const albumsRouter = express.Router();

albumsRouter.get('/', showAllAlbums);
albumsRouter.get('/:id', showAlbumById);
albumsRouter.get('/:id/photos/', showPhotosFromAlbum);
albumsRouter.get('/:idAlbum/photos/:idPhoto', showPhotoFromAlbumByIds);

const usersRouter = express.Router();

usersRouter.post('/', validation, addUser);
usersRouter.post('/sessions', validateIsOnDBSignIn, signIn);
usersRouter.get('/', validateIsOnDBList, listUsers);

module.exports = { albumsRouter, photosRouter, usersRouter, init };
