const app = require('../app');
const request = require('supertest');
const factory = require('./factories/users');
const { signToken } = require('../app/helpers/token');
const { statusCodes } = require('../app/helpers/response');

describe('Admin user endpoint test', () => {
  afterEach(() => factory.cleanUp());

  it('should return the user was updated as admin', async () => {
    const newUser = await factory.create({ privilegeLevel: 'admin' });
    const user = newUser.dataValues;
    const token = signToken(user.email);

    user.firstName = 'carla';
    user.lastName = 'maria';
    user.password = '12345678';

    const query = {
      access_token: token
    };

    const response = await request(app)
      .post('/admin/users')
      .query(query)
      .send(user);
    expect(response.text).toBe(
      `The user ${user.firstName} ${user.lastName} was successfully updated as admin`
    );
    expect(response.statusCode).toBe(statusCodes.ok);
  });

  it('should return the user was created as admin', async () => {
    const newUser = await factory.create({ privilegeLevel: 'admin' });
    const user = newUser.dataValues;
    const token = signToken(user.email);

    user.firstName = 'carla';
    user.lastName = 'maria';
    user.email = 'maria@wolox.com.ar';
    user.password = '12345678';

    const query = {
      access_token: token
    };

    const response = await request(app)
      .post('/admin/users')
      .query(query)
      .send(user);
    expect(response.text).toBe(
      `The user ${user.firstName} ${user.lastName} was successfully created as admin`
    );
    expect(response.statusCode).toBe(statusCodes.ok);
  });

  it('should return the token was not given', async () => {
    const newUser = await factory.create({});
    const user = newUser.dataValues;

    const response = await request(app)
      .post('/admin/users')
      .query()
      .send(user);
    expect(response.text).toBe('The token was not given');
    expect(response.statusCode).toBe(statusCodes.unauthorized);
  });

  it('should return the token given was a user token', async () => {
    const newUser = await factory.create({});
    const user = newUser.dataValues;
    const token = signToken(user.email);

    const query = {
      access_token: token
    };

    const response = await request(app)
      .post('/admin/users')
      .query(query)
      .send(user);
    expect(response.text).toBe(`The user ${user.firstName} ${user.lastName} is not authenticated as Admin`);
    expect(response.statusCode).toBe(statusCodes.unauthorized);
  });
});
