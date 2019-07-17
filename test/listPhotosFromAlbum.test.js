const app = require('../app');
const request = require('supertest');
const factory = require('./factories/users');
const { albumsCleanUp, albumsCreate } = require('./factories/albums');
const { signToken } = require('../app/helpers/token');
const nock = require('nock');
const { getPhotosFromAlbum, obtainAllPurchases } = require('../app/services/albums');
const { statusCodes } = require('../app/helpers/response');

describe('List photos from an album user test', () => {
  beforeEach(() => {
    factory.cleanUp();
    albumsCleanUp();
  });

  it('should return the photos from a purchased album', async () => {
    const albumToBuy = 48;

    nock('https://jsonplaceholder.typicode.com')
      .persist()
      .get('/photos?albumId=48')
      .reply(statusCodes.ok, [
        {
          albumId: 48,
          id: 2351,
          title: 'et asperiores reprehenderit voluptas quisquam aut est',
          url: 'https://via.placeholder.com/600/d29d30',
          thumbnailUrl: 'https://via.placeholder.com/150/d29d30'
        },
        {
          albumId: 48,
          id: 2352,
          title: 'aspernatur repellendus ex aliquid velit et molestiae mollitia minima',
          url: 'https://via.placeholder.com/600/232cb9',
          thumbnailUrl: 'https://via.placeholder.com/150/232cb9'
        },
        {
          albumId: 48,
          id: 2353,
          title: 'officia beatae minima ut',
          url: 'https://via.placeholder.com/600/ab5be6',
          thumbnailUrl: 'https://via.placeholder.com/150/ab5be6'
        }
      ]);

    const userObject = await factory.create({});
    const user = userObject.dataValues;

    await albumsCreate({ userId: user.id, externalReferenceId: albumToBuy });

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
    expect(response.text).toBe(JSON.stringify(linksToPhotosFromAlbum));
    expect(response.statusCode).toBe(200);
  });

  it('should return the photos from a non purchased album', async () => {
    const userObject = await factory.create({});
    const user = userObject.dataValues;

    const query = {
      access_token: signToken(user.email)
    };

    const albumToRetrieve = 57;

    const response = await request(app)
      .get(`/users/albums/${albumToRetrieve}/photos`)
      .query(query);
    expect(response.text).toBe(
      `The user with the id: ${user.id} has not bought the album ${albumToRetrieve}.`
    );
    expect(response.statusCode).toBe(400);
  });
});
