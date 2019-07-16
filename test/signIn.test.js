/* eslint-disable no-useless-escape */
const app = require('../app');
const request = require('supertest');
const factory = require('./factories/users');
const { verifyToken } = require('../app/helpers/token');
const { encryptPassword } = require('../app/helpers/encryption');
const { statusCodes } = require('../app/helpers/response');

describe('Sign In endpoint test', () => {
  beforeEach(() => factory.cleanUp());
  afterEach(() => factory.cleanUp());

  it('should return no input email', async () => {
    const newUser = await factory.build();
    const user = newUser.dataValues;
    user.email = undefined;
    user.password = undefined;

    const { email, password } = user;

    const userCredentials = {
      email,
      password
    };

    const response = await request(app)
      .post('/users/sessions')
      .send(userCredentials);
    expect(response.text).toBe('No input email!');
    expect(response.statusCode).toBe(statusCodes.bad_request);
  });

  it('should return no input password', async () => {
    const newUser = await factory.build();
    const user = newUser.dataValues;
    user.email = 'rodrigo.videla@woflox.com.ar';
    user.password = undefined;

    const { email, password } = user;

    const userCredentials = {
      email,
      password
    };

    const response = await request(app)
      .post('/users/sessions')
      .send(userCredentials);
    expect(response.text).toBe('No input password!');
    expect(response.statusCode).toBe(statusCodes.bad_request);
  });

  it('should return not a valid WOLOX email', async () => {
    const newUser = await factory.build();
    const user = newUser.dataValues;
    user.email = 'rodrigo.videla@woflox.com.ar';

    const { email, password } = user;

    const userCredentials = {
      email,
      password
    };

    const response = await request(app)
      .post('/users/sessions')
      .send(userCredentials);
    expect(response.text).toBe(`{\"error\":\"${user.email} is not a valid WOLOX email: Email not valid!\"}`);
    expect(response.statusCode).toBe(statusCodes.bad_request);
  });

  it('should return email not registered', async () => {
    const newUser = await factory.build();
    const user = newUser.dataValues;

    const { email, password } = user;

    const userCredentials = {
      email,
      password
    };

    const response = await request(app)
      .post('/users/sessions')
      .send(userCredentials);
    expect(response.text).toBe(`The email: ${userCredentials.email} is not registered.`);
    expect(response.statusCode).toBe(statusCodes.unauthorized);
  });

  it('should return the password was wrong', async () => {
    const mySuperPassword = 'mySuperPassword';
    const newUser = await factory.create({ password: encryptPassword(mySuperPassword) });
    const user = newUser.dataValues;

    const { email } = user;
    let { password } = user;
    password = mySuperPassword;
    password += 'a';

    const userCredentials = {
      email,
      password
    };

    const response = await request(app)
      .post('/users/sessions')
      .send(userCredentials);
    expect(response.text).toBe(
      `The password for the user with the email: ${userCredentials.email} was wrong.`
    );
    expect(response.statusCode).toBe(statusCodes.unauthorized);
  });

  it('should return the token', async () => {
    const mySuperPassword = 'mySuperPassword';
    const newUser = await factory.create({ password: encryptPassword(mySuperPassword) });
    const user = newUser.dataValues;

    const { email } = user;
    let { password } = user;
    password = mySuperPassword;

    const userCredentials = {
      email,
      password
    };

    const response = await request(app)
      .post('/users/sessions')
      .send(userCredentials);
    expect(JSON.parse(response.text).auth).toBe(true);
    expect(verifyToken(JSON.parse(response.text).token).email).toBe(user.email);
    expect(response.statusCode).toBe(statusCodes.ok);
  });
});
