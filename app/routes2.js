/* eslint-disable new-cap */

const albumsController = require('./controllers/albumsController');

const express = require('express');

const albumsRouter = express.Router();

albumsRouter.get('/', albumsController.showAllAlbums);
albumsRouter.get('/:id', albumsController.showAlbumById);
albumsRouter.get('/:id/photos/', albumsController.showPhotosFromAlbum);
albumsRouter.get('/:idAlbum/photos/:idPhoto', albumsController.showPhotoFromAlbumByIds);

module.exports = albumsRouter;
