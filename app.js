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

// `app.get()` call:
app.get('/', (req, res, next) => {
  console.log('/');
  // Here we would send back the moods array in response
  // console.log(req);
  // `Welcome, the requested data will be printed next: ${
  // res.json(gbody);
  res.send('/');
});

// `app.get()` call:
app.get('/albums', (req, res) => {
  console.log('----/albums----');

  request(`${url}/albums`, (error, response, body) => {
    // Print the error if one occurred
    console.log('error:', error);

    // Print the response status code if a response was received
    console.log('statusCode:', response && response.statusCode);

    res.send(body);
  });
});

// `app.get()` call:
app.get('/albums/:id', (req, res) => {
  console.log('----/albums----');
  console.log(req.params.id);

  // request(`${url}/albums`, (error, response, body) => {
  //   // Print the error if one occurred
  //   console.log('error:', error);

  //   // Print the response status code if a response was received
  //   console.log('statusCode:', response && response.statusCode);

  //   res.send(body);
  // });
});

// Opens the port
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
