/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
const app = require('../app');
const request = require('supertest');
const { obtainAllUsers } = require('../app/services/users');

describe('Sign Up endpoint test', () => {
  it('should add user correctly to the database', async () => {
    const user = {
      firstName: 'rodriasdgo',
      lastName: 'vasdaidela',
      email: 'rodasdfarfigo.videla@wolox.com.ar',
      password: 'asdagdsgasdf'
    };

    await request(app)
      .post('/users/')
      .send(user)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe(`The user ${user.firstName} ${user.lastName} was successfully created.`);
      });

    await obtainAllUsers({ where: { email: user.email } }).then(result => {
      expect(result[0].email).toBe(user.email);
    });
  });

  it('should return password length invalid', async () => {
    const user = {
      firstName: 'rodrigo',
      lastName: 'videla',
      email: 'rodrfigo.videla@wolox.com.ar',
      password: 'asdasdf'
    };

    await request(app)
      .post('/users/')
      .send(user)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe(
          `{\"error\":\"The input user data: ${user.firstName} ${user.lastName} ${user.email} is not valid: Password too short!\"}`
        );
      });
  });

  it('should return password not alphanumeric', async () => {
    const user = {
      firstName: 'rodrigo',
      lastName: 'videla',
      email: 'rodrigo.videla@wolox.com.ar',
      password: 'addd!dddsffh'
    };

    await request(app)
      .post('/users/')
      .send(user)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe(
          `{\"error\":\"The input user data: ${user.firstName} ${user.lastName} ${user.email} is not valid: Password is not alphanumeric!\"}`
        );
      });
  });

  it('should return email not valid', async () => {
    const user = {
      firstName: 'rodrigo',
      lastName: 'videla',
      email: 'rodrigo.videla@woflox.com.ar',
      password: 'addddddsffh'
    };

    await request(app)
      .post('/users/')
      .send(user)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe(
          `{\"error\":\"The input user data: ${user.firstName} ${user.lastName} ${user.email} is not valid: Email not valid!\"}`
        );
      });
  });
});
