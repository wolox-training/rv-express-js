const app = require('../app');
const request = require('supertest');
const factory = require('./factories/users');
const { signToken } = require('../app/helpers/token');
const { statusCodes } = require('../app/helpers/response');
const { EXPIRATION_TIME } = process.env;

describe('Token exipire test', () => {
  afterEach(() => factory.cleanUp());

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

  it('should return token expired', async () => {
    const newUser = await factory.create({});
    const user = newUser.dataValues;
    const token = signToken(user.email);

    const body = {
      access_token: token
    };

    function wait(ms) {
      const start = new Date().getTime();
      let end = start;
      while (end < start + ms) {
        end = new Date().getTime();
      }
    }

    wait((EXPIRATION_TIME + 0.5) * 100);

    const response = await request(app)
      .get('/users')
      .query({ page: 0, limit: 5 })
      .send(body);
    expect(response.text).toBe('There was an error');
    expect(response.statusCode).toBe(statusCodes.unauthorized);
  });
});
