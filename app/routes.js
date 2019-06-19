/* eslint-disable new-cap */

const express = require('express');
const albumsController = require('./controllers/albumsController');
const { healthCheck } = require('./controllers/healthCheck');

const init = app => {
  app.get('/health', healthCheck);
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};



const albumsRouter = express.Router();

albumsRouter.get('/', albumsController.showAllAlbums);
albumsRouter.get('/:id', albumsController.showAlbumById);
albumsRouter.get('/:id/photos/', albumsController.showPhotosFromAlbum);
albumsRouter.get('/:idAlbum/photos/:idPhoto', albumsController.showPhotoFromAlbumByIds);

module.exports = { albumsRouter, init };
