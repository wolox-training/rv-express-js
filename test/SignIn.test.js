/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
const app = require('../app');
const request = require('supertest');

describe('Sign In endpoint test', () => {
  it('should return no input email', () => {
    const userCredentials = {
      email: undefined,
      password: undefined
    };

    request(app)
      .post('/users/sessions')
      .send(userCredentials)
      .then(response => {
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('No input email!');
      });
  });

  it('should return no input password', () => {
    const userCredentials = {
      email: 'rodrigo.videla@woflox.com.ar',
      password: undefined
    };

    request(app)
      .post('/users/sessions')
      .send(userCredentials)
      .then(response => {
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('No input password!');
      });
  });

  it('should return not a valid WOLOX email', () => {
    const userCredentials = {
      email: 'rodrigo.videla@woflox.com.ar',
      password: 'asdaffdafasdf'
    };

    request(app)
      .post('/users/sessions')
      .send(userCredentials)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe(`The email: ${userCredentials.email} is not a valid WOLOX email.`);
      });
  });

  it('should return email not registered', () => {
    const userCredentials = {
      email: 'rodrigo.videla@wolox.com.ar',
      password: 'asdaffdafasdf'
    };

    request(app)
      .post('/users/sessions')
      .send(userCredentials)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe(`The email: ${userCredentials.email} is not registered.`);
      });
  });

  it('should return the password was wrong', () => {
    const userCredentials = {
      email: 'rodrigo.videla@wolox.com.ar',
      password: 'asdaffdafasdf'
    };

    request(app)
      .post('/users/sessions')
      .send(userCredentials)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe(
          `The password for the user with the email: ${userCredentials.email} was wrong.`
        );
      });
  });
});

// it('should return the token', () => {
//   const userCredentials = {
//     email: 'rodrigo.videla@wolox.com.ar',
//     password: 'contrasenia3171a'
//   };

//   request(app)
//     .post('/users/sessions')
//     .send(userCredentials)
//     .then(response => {
//       expect(response.statusCode).toBe(200);
//       expect(response.text).toBe({ auth: true, token });
//     });
// });
