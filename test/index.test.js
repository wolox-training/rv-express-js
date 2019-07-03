/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
const app = require('../app');
const request = require('supertest');

describe('Adds user to the database', () => {
  const user = {
    firstName: 'rodriasdgo',
    lastName: 'vasdaidela',
    email: 'rodasdfarfigo.videla@wolox.com.ar',
    password: 'asdagdsgasdf'
  };

  it('should add user correctly to the database', () =>
    request(app)
      .post('/users/')
      .send(user)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe(`The user ${user.firstName} ${user.lastName} was successfully created.`);
      }));
});

describe('Password length test', () => {
  const user = {
    firstName: 'rodrigo',
    lastName: 'videla',
    email: 'rodrfigo.videla@wolox.com.ar',
    password: 'asdasdf'
  };

  it('should return password length invalid', () =>
    request(app)
      .post('/users/')
      .send(user)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe(
          `{\"error\":\"The input user data: ${user.firstName} ${user.lastName} ${user.email} is not valid: Password too short!\"}`
        );
      }));
});

describe('Password alphanumeric test', () => {
  const user = {
    firstName: 'rodrigo',
    lastName: 'videla',
    email: 'rodrigo.videla@wolox.com.ar',
    password: 'addd!dddsffh'
  };

  it('should return password not alphanumeric', () =>
    request(app)
      .post('/users/')
      .send(user)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe(
          `{\"error\":\"The input user data: ${user.firstName} ${user.lastName} ${user.email} is not valid: Password is not alphanumeric!\"}`
        );
      }));
});

describe('Valid email test', () => {
  const user = {
    firstName: 'rodrigo',
    lastName: 'videla',
    email: 'rodrigo.videla@woflox.com.ar',
    password: 'addddddsffh'
  };

  it('should return email not valid', () =>
    request(app)
      .post('/users/')
      .send(user)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe(
          `{\"error\":\"The input user data: ${user.firstName} ${user.lastName} ${user.email} is not valid: Email not valid!\"}`
        );
      }));
});
