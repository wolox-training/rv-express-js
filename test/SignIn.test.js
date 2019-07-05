const app = require('../app');
const request = require('supertest');
const { cleanDB } = require('../app/services/users');
const jwt = require('jsonwebtoken');

describe('Sign In endpoint test', () => {
  afterEach(() => cleanDB());

  it('should return no input email', async () => {
    const userCredentials = {
      email: undefined,
      password: undefined
    };

    await request(app)
      .post('/users/sessions')
      .send(userCredentials)
      .then(response => {
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('No input email!');
      });
  });

  it('should return no input password', async () => {
    const userCredentials = {
      email: 'rodrigo.videla@woflox.com.ar',
      password: undefined
    };

    await request(app)
      .post('/users/sessions')
      .send(userCredentials)
      .then(response => {
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('No input password!');
      });
  });

  it('should return not a valid WOLOX email', async () => {
    const userCredentials = {
      email: 'rodrigo.videla@woflox.com.ar',
      password: 'password99'
    };

    await request(app)
      .post('/users/sessions')
      .send(userCredentials)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe(`The email: ${userCredentials.email} is not a valid WOLOX email.`);
      });
  });

  it('should return email not registered', async () => {
    const userCredentials = {
      email: 'rodrigo.videla@wolox.com.ar',
      password: 'password99'
    };

    await request(app)
      .post('/users/sessions')
      .send(userCredentials)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe(`The email: ${userCredentials.email} is not registered.`);
      });
  });

  it('should return the password was wrong', async () => {
    const user = {
      firstName: 'rodrigo',
      lastName: 'videla',
      email: 'rodrigo.videla@wolox.com.ar',
      password: 'password99'
    };

    const userCredentials = {
      email: 'rodrigo.videla@wolox.com.ar',
      password: 'password991'
    };

    await request(app)
      .post('/users')
      .send(user)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe(`The user ${user.firstName} ${user.lastName} was successfully created.`);
      });

    await request(app)
      .post('/users/sessions')
      .send(userCredentials)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe(
          `The password for the user with the email: ${userCredentials.email} was wrong.`
        );
      });
  });

  it('should return the token', async () => {
    const user = {
      firstName: 'rodrigo',
      lastName: 'videla',
      email: 'rodrigo.videla@wolox.com.ar',
      password: 'password99'
    };

    const userCredentials = {
      email: 'rodrigo.videla@wolox.com.ar',
      password: 'password99'
    };

    await request(app)
      .post('/users')
      .send(user)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe(`The user ${user.firstName} ${user.lastName} was successfully created.`);
      });

    await request(app)
      .post('/users/sessions')
      .send(userCredentials)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.text).auth).toBe(true);
        expect(jwt.verify(JSON.parse(response.text).token, 'shhhhh').email).toBe(user.email);
      });
  });
});
