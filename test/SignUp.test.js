/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
const app = require('../app');
const request = require('supertest');
const { obtainAllUsers, cleanDB } = require('../app/services/users');

describe('Sign Up endpoint test', () => {
  afterEach(() => cleanDB());

  it('should add user correctly to the database', async () => {
    const user = {
      firstName: 'rodrigo',
      lastName: 'videla',
      email: 'rodrigo.videla@wolox.com.ar',
      password: 'password99'
    };

    const response = await request(app)
      .post('/users')
      .send(user);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe(`The user ${user.firstName} ${user.lastName} was successfully created.`);

    const userResult = await obtainAllUsers({ where: { email: user.email } });
    expect(userResult[0].email).toBe(user.email);
  });

  it('should return password length invalid', async () => {
    const user = {
      firstName: 'rodrigo',
      lastName: 'videla',
      email: 'rodrfigo.videla@wolox.com.ar',
      password: 'passw'
    };

    const response = await request(app)
      .post('/users/')
      .send(user);
    expect(response.statusCode).toBe(500);
    expect(response.text).toBe(
      `{\"error\":\"The input user data: ${user.firstName} ${user.lastName} ${user.email} is not valid: Password too short!\"}`
    );
  });

  it('should return password not alphanumeric', async () => {
    const user = {
      firstName: 'rodrigo',
      lastName: 'videla',
      email: 'rodrigo.videla@wolox.com.ar',
      password: 'pass!word99'
    };

    const response = await request(app)
      .post('/users/')
      .send(user);
    expect(response.statusCode).toBe(500);
    expect(response.text).toBe(
      `{\"error\":\"The input user data: ${user.firstName} ${user.lastName} ${user.email} is not valid: Password is not alphanumeric!\"}`
    );
  });

  it('should return email not valid', async () => {
    const user = {
      firstName: 'rodrigo',
      lastName: 'videla',
      email: 'rodrigo.videla@woflox.com.ar',
      password: 'password99'
    };

    const response = await request(app)
      .post('/users/')
      .send(user);
    expect(response.statusCode).toBe(500);
    expect(response.text).toBe(
      `{\"error\":\"The input user data: ${user.firstName} ${user.lastName} ${user.email} is not valid: Email not valid!\"}`
    );
  });
});
