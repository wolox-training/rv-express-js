/* eslint-disable new-cap */



const requestLib = require('../helpers/request');
const request = requestLib( {
                              url: 'URL',
                              method: 'post',
                              json: true,
                              body: {},
                              headers: {} });

// const request = require('request');
const { ALBUMS_API_URL: url } = require('../../config/environment.js');





// const requestAllAlbums = url => {
//   request(`${url}/albums`, (error, response, body) => {
//     console.log('error:', error);
//     console.log('statusCode:', response && response.statusCode);

//     return body;
//   });
// };

// const requestAlbumById = (url, id) => {
//   request(`${url}/albums/${id}`, (error, response, body) => {
//     console.log('error:', error);
//     console.log('statusCode:', response && response.statusCode);

//     return body;
//   });
// };

// const requestPhotosFromAlbum = (url, id) => {
//   request(`${url}/photos?albumId=${id}`, (error, response, body) => {
//     console.log('error:', error);
//     console.log('statusCode:', response && response.statusCode);

//     return body;
//   });
// };

// const requestPhotoFromAlbumById = (url, idAlbum, idPhoto) => {
//   request(`${url}/photos?albumId=${idAlbum}&id=${idPhoto}`, (error, response, body) => {
//     console.log('error:', error);
//     console.log('statusCode:', response && response.statusCode);

//     return body;
//   });
// };





const showAllAlbums = (req, res) => {
  console.log('----/albums----');

  request(`${url}/albums`, (error, response, body) => {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);

    res.send(body);
  });

  // res.send(requestAllAlbums(req, res, url));
};

const showAlbumById = (req, res) => {
  const { id } = req.params;

  console.log('\n\n----/albums by id number----');
  console.log(`Album Id: ${id}`);

  request(`${url}/albums/${id}`, (error, response, body) => {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);

    res.send(body);
  });

  // res.send(requestAlbumById(req, res, url, id));
};

const showPhotosFromAlbum = (req, res) => {
  const { id } = req.params;

  console.log('----/photos from a certain album(specified by its Id)----');
  console.log(`Album Id: ${id}`);

  request(`${url}/photos?albumId=${id}`, (error, response, body) => {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);

    res.send(body);
  });

  // res.send(requestPhotosFromAlbum(req, res, url, id));
};

const showPhotoFromAlbumByIds = (req, res) => {
  const { idPhoto, idAlbum } = req.params;

  console.log('----/Photo(specified by its Id) from a certain album(specified by its Id)----');
  console.log(`Album Id: ${idAlbum}`);
  console.log(`Photo Id: ${idPhoto}`);

  request(`${url}/photos?albumId=${idAlbum}&id=${idPhoto}`, (error, response, body) => {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);

    res.send(body);
  });

  // res.send(requestPhotoFromAlbumById(req, res, url, idAlbum, idPhoto));
};
















// const photosRouter = express.Router();

// photosRouter.get('/', (req, res) => {
//   console.log('----/photos----');

//   request(`${url}/photos`, (error, response, body) => {
//     console.log('error:', error);

//     console.log('statusCode:', response && response.statusCode);

//     res.send(body);
//   });
// });

// photosRouter.get('/:id', (req, res) => {
//   const { id } = req.params;

//   console.log('----/photos by id number----');
//   console.log(`Photo Id: ${id}`);

//   request(`${url}/photos/${id}`, (error, response, body) => {
//     console.log('error:', error);

//     console.log('statusCode:', response && response.statusCode);

//     res.send(body);
//   });
// });

module.exports = { showAllAlbums, showAlbumById, showPhotosFromAlbum, showPhotoFromAlbumByIds };