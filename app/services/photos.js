const { ALBUMS_API_URL: url } = require('../../config/environment.js');
const { request } = require('../helpers/request');

const getAllPhotos = () =>
  request({
    url: `${url}/photos`,
    method: 'get',
    json: true
  });

const getPhotoById = id =>
  request({
    url: `${url}/photos/${id}`,
    method: 'get',
    json: true
  });

module.exports = { getAllPhotos, getPhotoById };
