const { ALBUMS_API_URL: url } = require('../../config/environment.js');
const { request } = require('../helpers/request');

const getAllAlbums = () =>
  request({
    url: `${url}/albums`,
    method: 'get',
    json: true
  });

const getAlbumById = id =>
  request({
    url: `${url}/albums/${id}`,
    method: 'get',
    json: true
  });

const getPhotosFromAlbum = id =>
  request({
    url: `${url}/photos?albumId=${id}`,
    method: 'get',
    json: true
  });

const getPhotoFromAlbumByIds = (idAlbum, idPhoto) =>
  request({
    url: `${url}/photos?albumId=${idAlbum}&id=${idPhoto}`,
    method: 'get',
    json: true
  });

const { UserAlbums } = require('../models');

const obtainAllPurchases = parameters => UserAlbums.findAll(parameters);
const obtainOnePurchase = parameters => UserAlbums.findOne(parameters);
const registerPurchase = purchase => UserAlbums.create(purchase);

module.exports = {
  getAllAlbums,
  getAlbumById,
  getPhotosFromAlbum,
  getPhotoFromAlbumByIds,
  obtainAllPurchases,
  obtainOnePurchase,
  registerPurchase
};
