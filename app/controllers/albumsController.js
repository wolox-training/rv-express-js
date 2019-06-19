/* eslint-disable new-cap */

const {getAllAlbums} = require('../services/albums');


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

  // const myPromiseRequest = requestLib.request({
  //   url: 'URL',
  //   method: 'post',
  //   json: true,
  //   body: {},
  //   headers: {}
  // });

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

  // const myPromiseRequest = requestLib.request({
  //   url: 'URL',
  //   method: 'post',
  //   json: true,
  //   body: {},
  //   headers: {}
  // });

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

  // const myPromiseRequest = requestLib.request({
  //   url: 'URL',
  //   method: 'post',
  //   json: true,
  //   body: {},
  //   headers: {}
  // });

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