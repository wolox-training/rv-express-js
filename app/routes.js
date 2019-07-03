/* eslint-disable new-cap */

const express = require('express');
const albumsController = require('./controllers/albumsController');
const photosController = require('./controllers/photosController');
const usersController = require('./controllers/usersController');
const validate = require('./middlewares/validations');
const { healthCheck } = require('./controllers/healthCheck');

const init = app => {
  app.get('/health', healthCheck);
};

const photosRouter = express.Router();

photosRouter.get('/', photosController.showAllPhotos);
photosRouter.get('/:id', photosController.showPhotoById);

const albumsRouter = express.Router();

albumsRouter.get('/', albumsController.showAllAlbums);
albumsRouter.get('/:id', albumsController.showAlbumById);
albumsRouter.get('/:id/photos/', albumsController.showPhotosFromAlbum);
albumsRouter.get('/:idAlbum/photos/:idPhoto', albumsController.showPhotoFromAlbumByIds);

const usersRouter = express.Router();

usersRouter.post('/', [validate], usersController.addUser);

module.exports = { albumsRouter, photosRouter, usersRouter, init };
