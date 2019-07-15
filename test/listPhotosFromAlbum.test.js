const app = require('../app');
const request = require('supertest');
const factory = require('./factories/users');
const { albumsCleanUp, albumsCreate } = require('./factories/albums');
const { signToken } = require('../app/helpers/token');
const faker = require('faker');
const nock = require('nock');
const { getPhotosFromAlbum, obtainAllPurchases } = require('../app/services/albums');

describe('List albums from a user test', () => {
  beforeEach(() => {
    factory.cleanUp();
    albumsCleanUp();
  });

  it('should return the photos from a purchased album', async () => {
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

    const userObject = await factory.create({});
    const user = userObject.dataValues;

    await albumsCreate({ userId: user.id, externalReferenceId: albumToBuy() });

    const query = {
      access_token: signToken(user.email)
    };

    const purchases = await obtainAllPurchases({ where: { userId: user.id } });
    const idsOfAlbums = purchases.map(element => element.dataValues.externalReferenceId);

    const photosFromAlbumObject = await getPhotosFromAlbum(idsOfAlbums[0]);
    const linksToPhotosFromAlbum = photosFromAlbumObject.body.map(photoObject => photoObject.url);

    const response = await request(app)
      .get(`/users/albums/${idsOfAlbums[0]}/photos`)
      .query(query);
    expect(response.text).toBe(
      `The user with the id: ${user.id} has the following photos: ${linksToPhotosFromAlbum}`
    );
    expect(response.statusCode).toBe(200);
  });

  it('should return the photos from a non purchased album', async () => {
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

    const userObject = await factory.create({});
    const user = userObject.dataValues;

    const query = {
      access_token: signToken(user.email)
    };

    const albumToRetrieve = albumToBuy();

    const response = await request(app)
      .get(`/users/albums/${albumToRetrieve}/photos`)
      .query(query);
    expect(response.text).toBe(
      `The user with the id: ${user.id} has not bought the album ${albumToRetrieve}.`
    );
    expect(response.statusCode).toBe(400);
  });
});
