const { factory } = require('factory-girl');
const faker = require('faker');
// models = require('../app/models'),
// { user: User } = models;
const { User } = require('../../app/models');
const { encryptPassword } = require('../../app/helpers/encryption');

factory.define('User', User, {
  firstName: () => faker.name.firstName(),
  lastName: () => faker.name.lastName(),
  email: () => `${faker.name.lastName()}@wolox.com.ar`,
  password: encryptPassword(factory.chance('word', { length: 8 })())
});

const cleanUp = () => factory.cleanUp();
const create = ({ password }) => {
  const buildOptions = password ? { password } : undefined;
  return factory.create('User', buildOptions);
};

const createMany = () => factory.createMany('User', 5);
const build = () => factory.build('User');

module.exports = { cleanUp, create, createMany, build };
