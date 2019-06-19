const { ALBUMS_API_URL: url } = require('../../config/environment.js');
const { request } = require('../helpers/request');

const getAllAlbums = () =>
  request({
    url: `${url}/albums`,
    method: 'get',
    json: true
  });

module.exports = { getAllAlbums };
