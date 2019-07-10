const app = require('../app');
const request = require('supertest');
const { factory } = require('factory-girl');
const { User } = require('../app/models');
const { signToken } = require('../app/helpers/token');

describe('List Users endpoint test', () => {
  factory.define('User', User, {
    firstName: factory.chance('name'),
    lastName: factory.chance('name'),
    email: factory.sequence('user.email', n => `dummy-user-${n}@wolox.com.ar`),
    password: factory.chance('word', { length: 8 })
  });

  afterEach(() => factory.cleanUp());

  it('should return the token was not given', async () => {
    const body = {
      access_token: undefined
    };

    const response = await request(app)
      .get('/users')
      .query({ page: 0, limit: 5 })
      .send(body);
    expect(response.statusCode).toBe(500);
    expect(response.text).toBe('The token was not given');
  });

  it('should return the user is not authenticated', async () => {
    const newUser = await factory.build('User');
    const user = newUser.dataValues;
    const token = signToken(user.email);

    const body = {
      access_token: token
    };

    const response = await request(app)
      .get('/users')
      .query({ page: 0, limit: 5 })
      .send(body);
    expect(response.statusCode).toBe(500);
    expect(response.text).toBe('The user is not authenticated');
  });

  it('should return the first entry of the DB', async () => {
    const newUser = await factory.create('User');
    const user = newUser.dataValues;
    const token = signToken(user.email);

    const body = {
      access_token: token
    };

    const response = await request(app)
      .get('/users')
      .query()
      .send(body);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.text).firstName).toBe(user.firstName);
    expect(JSON.parse(response.text).lastName).toBe(user.lastName);
    expect(JSON.parse(response.text).email).toBe(user.email);
  });

  it('should return invalid query value', async () => {
    const newUser = await factory.create('User');
    const user = newUser.dataValues;
    const token = signToken(user.email);

    const body = {
      access_token: token
    };

    const response = await request(app)
      .get('/users')
      .query({ page: -1, limit: 5 })
      .send(body);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Invalid query value');
  });

  it('should return success', async () => {
    const newUser = await factory.create('User');
    const user = newUser.dataValues;
    const token = signToken(user.email);

    const body = {
      access_token: token
    };

    const response = await request(app)
      .get('/users')
      .query({ page: 0, limit: 5 })
      .send(body);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.text)[0].firstName).toBe(user.firstName);
    expect(JSON.parse(response.text)[0].lastName).toBe(user.lastName);
    expect(JSON.parse(response.text)[0].email).toBe(user.email);
  });
});
