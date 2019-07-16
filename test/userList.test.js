const app = require('../app');
const request = require('supertest');
const factory = require('./factories/users');
const { signToken } = require('../app/helpers/token');
const { statusCodes } = require('../app/helpers/response');

describe('List Users endpoint test', () => {
  afterEach(() => factory.cleanUp());

  it('should return the token was not given', async () => {
    const body = {
      access_token: undefined
    };

    const response = await request(app)
      .get('/users')
      .query({ page: 0, limit: 5 })
      .send(body);
    expect(response.text).toBe('The token was not given');
    expect(response.statusCode).toBe(statusCodes.unauthorized);
  });

  it('should return the user is not authenticated', async () => {
    const newUser = await factory.build();
    const user = newUser.dataValues;
    const token = signToken(user.email);

    const body = {
      access_token: token
    };

    const response = await request(app)
      .get('/users')
      .query({ page: 0, limit: 5 })
      .send(body);
    expect(response.text).toBe('The user is not authenticated');
    expect(response.statusCode).toBe(statusCodes.unauthorized);
  });

  it('should return the first entry of the DB', async () => {
    const newUser = await factory.create({});
    const user = newUser.dataValues;
    const token = signToken(user.email);

    const body = {
      access_token: token
    };

    const response = await request(app)
      .get('/users')
      .query()
      .send(body);
    expect(JSON.parse(response.text).firstName).toBe(user.firstName);
    expect(JSON.parse(response.text).lastName).toBe(user.lastName);
    expect(JSON.parse(response.text).email).toBe(user.email);
    expect(response.statusCode).toBe(statusCodes.ok);
  });

  it('should return invalid query value', async () => {
    const newUser = await factory.create({});
    const user = newUser.dataValues;
    const token = signToken(user.email);

    const body = {
      access_token: token
    };

    const response = await request(app)
      .get('/users')
      .query({ page: -1, limit: 5 })
      .send(body);
    expect(response.text).toBe('Invalid query value');
    expect(response.statusCode).toBe(statusCodes.bad_request);
  });

  it('should return success', async () => {
    const newUser = await factory.create({});
    const user = newUser.dataValues;
    const token = signToken(user.email);

    const body = {
      access_token: token
    };

    const response = await request(app)
      .get('/users')
      .query({ page: 0, limit: 5 })
      .send(body);
    expect(JSON.parse(response.text)[0].firstName).toBe(user.firstName);
    expect(JSON.parse(response.text)[0].lastName).toBe(user.lastName);
    expect(JSON.parse(response.text)[0].email).toBe(user.email);
    expect(response.statusCode).toBe(statusCodes.ok);
  });
});
