/* eslint-disable new-cap */

const { expressMiddleware, expressRequestIdMiddleware } = require('express-wolox-logger'),
  express = require('express'),
  bodyParser = require('body-parser'),
  path = require('path'),
  config = require('./config'),
  errors = require('./app/middlewares/errors'),
  DEFAULT_BODY_SIZE_LIMIT = 1024 * 1024 * 10,
  DEFAULT_PARAMETER_LIMIT = 10000;

const { photosRouter, albumsRouter, usersRouter, adminRouter, init } = require('./app/routes');

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

app.use(bodyParser.json(bodyParserJsonConfig()));
app.use(bodyParser.urlencoded(bodyParserUrlencodedConfig()));
app.use(expressRequestIdMiddleware);

if (!config.isTesting) {
  app.use(expressMiddleware);
}

init(app);
app.use(errors.handle);
module.exports = app;

const PORT = process.env.PORT || 4001;
app.use(express.static('public'));

app.use('/photos', photosRouter);
app.use('/albums', albumsRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

app.get('/', (req, res) => {
  res.send('Do you want to see albums, photos? Specify that in the endpoint!');
});

app.listen(PORT);
