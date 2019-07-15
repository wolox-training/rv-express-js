const app = require('../app');
const request = require('supertest');
const factory = require('./factories/users');
const { albumsCleanUp, albumsCreate } = require('./factories/albums');
const { signToken } = require('../app/helpers/token');
const { getAlbumById } = require('../app/services/albums');
const nock = require('nock');

describe('Buy album test', () => {
  beforeEach(() => {
    factory.cleanUp();
    albumsCleanUp();
  });

  it('should return album already purchased', async () => {
    const albumToBuy = 88;

    const newUser = await factory.create({});
    const user = newUser.dataValues;

    await albumsCreate({ userId: user.id, externalReferenceId: albumToBuy });

    const token = signToken(user.email);

    const query = {
      access_token: token
    };

    const response = await request(app)
      .post(`/albums/${albumToBuy}`)
      .query(query);
    expect(response.text).toBe('The album was already purchased.');
    expect(response.statusCode).toBe(500);
  });

  it('should return album successfully purchased', async () => {
    const albumToBuy = 76;

    nock('https://jsonplaceholder.typicode.com')
      .persist()
      .get(`/albums/${albumToBuy}`)
      .replyWithFile(200, `${__dirname}/fixtures/albums/getAlbumsResponse.json`, {
        'Content-Type': 'application/json'
      });

    const newUser = await factory.create({});
    const user = newUser.dataValues;

    const token = signToken(user.email);

    const query = {
      access_token: token
    };

    const album = await getAlbumById(albumToBuy);
    const albumName = album.body.title;

    const response = await request(app)
      .post(`/albums/${albumToBuy}`)
      .query(query);
    expect(response.text).toBe(
      `The user ${user.firstName} ${user.lastName} successfully purchased the album "${albumName}", id: ${albumToBuy}`
    );
    expect(response.statusCode).toBe(200);
  });

  it('should return token not given', async () => {
    const albumToBuy = 14;

    await factory.create({});

    const query = {
      access_token: undefined
    };

    const response = await request(app)
      .post(`/albums/${albumToBuy}`)
      .query(query);
    expect(response.text).toBe('The token was not given');
    expect(response.statusCode).toBe(400);
  });
});
