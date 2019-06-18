/* eslint-disable new-cap */
const { expressMiddleware, expressRequestIdMiddleware } = require('express-wolox-logger'),
  express = require('express'),
  bodyParser = require('body-parser'),
  path = require('path'),
  config = require('./config'),
  routes = require('./app/routes'),
  errors = require('./app/middlewares/errors'),
  DEFAULT_BODY_SIZE_LIMIT = 1024 * 1024 * 10,
  DEFAULT_PARAMETER_LIMIT = 10000;

const bodyParserJsonConfig = () => ({
  parameterLimit: config.common.api.parameterLimit || DEFAULT_PARAMETER_LIMIT,
  limit: config.common.api.bodySizeLimit || DEFAULT_BODY_SIZE_LIMIT
});

const bodyParserUrlencodedConfig = () => ({
  extended: true,
  parameterLimit: config.common.api.parameterLimit || DEFAULT_PARAMETER_LIMIT,
  limit: config.common.api.bodySizeLimit || DEFAULT_BODY_SIZE_LIMIT
});

const app = express();

app.use('/docs', express.static(path.join(__dirname, 'docs')));

// Client must send "Content-Type: application/json" header
app.use(bodyParser.json(bodyParserJsonConfig()));
app.use(bodyParser.urlencoded(bodyParserUrlencodedConfig()));
app.use(expressRequestIdMiddleware);

if (!config.isTesting) {
  app.use(expressMiddleware);
}

routes.init(app);

app.use(errors.handle);

module.exports = app;

// ---------
// ---------
// ---------
// ---------
// ---------
// ---------
// ---------
// ---------
// ---------
const request = require('request');

// This URL should return JSON data
const url = 'https://jsonplaceholder.typicode.com';

const PORT = process.env.PORT || 4001;

// Use static server to serve the API
app.use(express.static('public'));

const photosRouter = express.Router();
app.use('/photos', photosRouter);

const albumsRouter = express.Router();
app.use('/albums', albumsRouter);

// `app.get()` call:
app.get('/', (req, res) => {
  console.log('/');
  // Here we would send back the moods array in response
  // console.log(req);
  // `Welcome, the requested data will be printed next: ${
  // res.json(gbody);
  res.send('Do you want to see albums, photos? Specify that in the endpoint!');
});

// We show all the albums:
albumsRouter.get('/', (req, res) => {
  console.log('----/albums----');

  request(`${url}/albums`, (error, response, body) => {
    // Print the error if one occurred
    console.log('error:', error);

    // Print the response status code if a response was received
    console.log('statusCode:', response && response.statusCode);

    res.send(body);
  });
});

// We show the album specified by its Id:
albumsRouter.get('/:id', (req, res) => {
  const { id } = req.params;

  console.log('\n\n----/albums by id number----');
  console.log(`Album Id: ${id}`);

  request(`${url}/albums/${id}`, (error, response, body) => {
    // Print the error if one occurred
    console.log('error:', error);

    // Print the response status code if a response was received
    console.log('statusCode:', response && response.statusCode);

    res.send(body);
  });
});

// We show the photos from an album specified by its Id:
albumsRouter.get('/:id/photos/', (req, res) => {
  const { id } = req.params;

  console.log('----/photos from a certain album(specified by its Id)----');
  console.log(`Album Id: ${id}`);

  request(`${url}/photos?albumId=${id}`, (error, response, body) => {
    // Print the error if one occurred
    console.log('error:', error);

    // Print the response status code if a response was received
    console.log('statusCode:', response && response.statusCode);

    res.send(body);
  });
});

// We show a photo from an album specified by its Id:
albumsRouter.get('/:idAlbum/photos/:idPhoto', (req, res) => {
  const { idAlbum } = req.params;
  const { idPhoto } = req.params;

  console.log('----/Photo(specified by its Id) from a certain album(specified by its Id)----');
  console.log(`Album Id: ${idAlbum}`);
  console.log(`Photo Id: ${idPhoto}`);

  request(`${url}/photos?albumId=${idAlbum}&id=${idPhoto}`, (error, response, body) => {
    // Print the error if one occurred
    console.log('error:', error);

    // Print the response status code if a response was received
    console.log('statusCode:', response && response.statusCode);

    res.send(body);
  });
});

// We show all the photos:
photosRouter.get('/', (req, res) => {
  console.log('----/photos----');

  request(`${url}/photos`, (error, response, body) => {
    // Print the error if one occurred
    console.log('error:', error);

    // Print the response status code if a response was received
    console.log('statusCode:', response && response.statusCode);

    res.send(body);
  });
});

// We show a photo by its Id:
photosRouter.get('/:id', (req, res) => {
  const { id } = req.params;

  console.log('----/photos by id number----');
  console.log(`Photo Id: ${id}`);

  request(`${url}/photos/${id}`, (error, response, body) => {
    // Print the error if one occurred
    console.log('error:', error);

    // Print the response status code if a response was received
    console.log('statusCode:', response && response.statusCode);

    res.send(body);
  });
});

// Opens the port
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
