/* eslint-disable curly */
const { factory } = require('factory-girl');
const faker = require('faker');
const { UserAlbums } = require('../../app/models');

factory.define('UserAlbums', UserAlbums, {
  userId: () => faker.Number.between(1, 100),
  externalReferenceId: () => faker.Number.between(1, 100)
});

const albumsCleanUp = () => factory.cleanUp();

const albumsCreate = ({ userId, externalReferenceId }) => {
  const buildOptions = {};
  if (userId) buildOptions.userId = userId;
  if (externalReferenceId) buildOptions.externalReferenceId = externalReferenceId;
  return factory.create('UserAlbums', buildOptions);
};

const albumsCreateMany = () => factory.createMany('UserAlbums', 5);
const albumsBuild = () => factory.build('UserAlbums');

module.exports = { albumsCleanUp, albumsCreate, albumsCreateMany, albumsBuild };
