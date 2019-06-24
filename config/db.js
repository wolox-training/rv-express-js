const config = require('../config').common.database;

module.exports = {
  development: {
    user: config.username,
    username: config.username,
    password: config.password,
    database: config.name,
    host: config.host,
    dialect: 'postgres',
    logging: true
  },
  testing: {
    user: config.username,
    username: config.username,
    password: config.password,
    database: config.name,
    host: config.host,
    dialect: 'postgres',
    logging: false
  },
  production: {
    user: config.username,
    username: config.username,
    password: config.password,
    database: config.name,
    host: config.host,
    dialect: 'postgres',
    logging: false
  }
};

// Nombre de las bases de datos:
// Para la de develompent: rv-express-dev
// Para la de test: rv-express-test