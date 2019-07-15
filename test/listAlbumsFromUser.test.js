const app = require('../app');
const request = require('supertest');
const factory = require('./factories/users');
const { albumsCleanUp, albumsCreate } = require('./factories/albums');
const { signToken } = require('../app/helpers/token');
const faker = require('faker');
const nock = require('nock');
const { getAlbumById, obtainAllPurchases } = require('../app/services/albums');

// probar que un usuario normal no puede acceder a albums de otro usuario
// probar que un usuario normal puede acceder a sus albums

describe.only('List albums from a user test', () => {
  beforeEach(() => {
    factory.cleanUp();
    albumsCleanUp();
  });

  it('should return the albums from another user being admin', async () => {
    nock('http://localhost:8081')
      .get('/albums')
      .replyWithFile(200, `${__dirname}/fixtures/albums/getAlbumsResponse.json`, {
        'Content-Type': 'application/json'
      });

    const albumToBuy = () =>
      faker.random.number({
        min: 1,
        max: 100
      });

    const normalUserObject = await factory.create({});
    const normalUser = normalUserObject.dataValues;
    const adminUserObject = await factory.create({ privilegeLevel: 'admin' });
    const adminUser = adminUserObject.dataValues;

    for (let i = 0; i < 3; i++) {
      await albumsCreate({ userId: normalUser.id, externalReferenceId: albumToBuy() });
      await albumsCreate({ userId: adminUser.id, externalReferenceId: albumToBuy() });
    }

    const query = {
      access_token: signToken(adminUser.email)
    };

    const purchases = await obtainAllPurchases({ where: { userId: normalUser.id } });
    const idsOfAlbums = purchases.map(element => element.dataValues.externalReferenceId);
    const albumsFromUser = await Promise.all(idsOfAlbums.map(result => getAlbumById(result)));
    const titlesFromAlbumsFromUser = albumsFromUser.map(result => result.body.title);

    const response = await request(app)
      .get(`/users/${normalUser.id}/albums`)
      .query(query);
    expect(response.text).toBe(
      `The user with the id: ${normalUser.id} has the following albums: ${titlesFromAlbumsFromUser}`
    );
    expect(response.statusCode).toBe(200);
  });

  it('should return the albums from another user being admin', async () => {
    nock('http://localhost:8081')
      .get('/albums')
      .replyWithFile(200, `${__dirname}/fixtures/albums/getAlbumsResponse.json`, {
        'Content-Type': 'application/json'
      });

    const albumToBuy = () =>
      faker.random.number({
        min: 1,
        max: 100
      });

    const normalUser1Object = await factory.create({});
    const normalUser1 = normalUser1Object.dataValues;
    const normalUser2Object = await factory.create({ privilegeLevel: 'admin' });
    const normalUser2 = normalUser2Object.dataValues;

    for (let i = 0; i < 3; i++) {
      await albumsCreate({ userId: normalUser1.id, externalReferenceId: albumToBuy() });
      await albumsCreate({ userId: normalUser2.id, externalReferenceId: albumToBuy() });
    }

    const query = {
      access_token: signToken(normalUser1.email)
    };

    const response = await request(app)
      .get(`/users/${normalUser2.id}/albums`)
      .query(query);
    expect(response.text).toBe("This user cannot access these User's albums.");
    expect(response.statusCode).toBe(400);
  });

  it('should return the albums of the user', async () => {
    nock('http://localhost:8081')
      .get('/albums')
      .replyWithFile(200, `${__dirname}/fixtures/albums/getAlbumsResponse.json`, {
        'Content-Type': 'application/json'
      });

    const albumToBuy = () =>
      faker.random.number({
        min: 1,
        max: 100
      });

    const normalUserObject = await factory.create({});
    const normalUser = normalUserObject.dataValues;

    for (let i = 0; i < 3; i++) {
      await albumsCreate({ userId: normalUser.id, externalReferenceId: albumToBuy() });
    }

    const purchases = await obtainAllPurchases({ where: { userId: normalUser.id } });
    const idsOfAlbums = purchases.map(element => element.dataValues.externalReferenceId);
    const albumsFromUser = await Promise.all(idsOfAlbums.map(result => getAlbumById(result)));
    const titlesFromAlbumsFromUser = albumsFromUser.map(result => result.body.title);

    const query = {
      access_token: signToken(normalUser.email)
    };

    const response = await request(app)
      .get(`/users/${normalUser.id}/albums`)
      .query(query);
    expect(response.text).toBe(
      `The user with the id: ${normalUser.id} has the following albums: ${titlesFromAlbumsFromUser}`
    );
    expect(response.statusCode).toBe(200);
  });
});
