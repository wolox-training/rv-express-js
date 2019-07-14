/* eslint-disable new-cap */

const express = require('express');
const {
  showAllAlbums,
  showAlbumById,
  showPhotosFromAlbum,
  showPhotoFromAlbumByIds,
  buyAlbum,
  listAlbumsFromUser
} = require('./controllers/albumsController');
const { showAllPhotos, showPhotoById } = require('./controllers/photosController');

const { addUser, signIn, listUsers, addAdminUser } = require('./controllers/usersController');
const {
  isUserDataPresent,
  areCredentialsPresent,
  areCredentialsValid,
  isEmailValid,
  isLoginValid,
  isAuthenticated,
  isAuthenticatedAsAdmin
} = require('./middlewares/users/validations');

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
albumsRouter.post('/:id', isAuthenticated, buyAlbum);

const usersRouter = express.Router();
usersRouter.post('/', isUserDataPresent, areCredentialsPresent, areCredentialsValid, addUser);
usersRouter.post('/sessions', areCredentialsPresent, isEmailValid, isLoginValid, signIn);
usersRouter.get('/', isAuthenticated, listUsers);
usersRouter.get('/:user_id/albums', isAuthenticated, listAlbumsFromUser);

const adminRouter = express.Router();
adminRouter.post(
  '/users',
  isAuthenticated,
  isAuthenticatedAsAdmin,
  isUserDataPresent,
  areCredentialsPresent,
  areCredentialsValid,
  addAdminUser
);

module.exports = { albumsRouter, photosRouter, usersRouter, adminRouter, init };
