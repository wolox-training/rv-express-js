const app = require('../app');
const request = require('supertest');
const { cleanDB } = require('../app/services/users');
const jwt = require('jsonwebtoken');

describe('List Users endpoint test', () => {
  afterEach(() => cleanDB());

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
    const body = {
      access_token:
        // eslint-disable-next-line max-len
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhcnBhemFAd29sb3guY29tLmFyIiwiaWF0IjoxNTYyMzYwMTQ2fQ.paL_6LPAcb6FNKWWjhDIC2KGnu39quJ53Yre2gQrqvg'
    };

    const response = await request(app)
      .get('/users')
      .query({ page: 0, limit: 5 })
      .send(body);

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe('The user is not authenticated');
  });

  it('should return the first entry of the DB', async () => {
    const firstName = 'rodrigo';
    const lastName = 'videla';
    const email = 'carpaza@wolox.com.ar';
    const password = 'password99';

    const user = {
      firstName,
      lastName,
      email,
      password
    };

    const userCredentials = {
      email,
      password
    };

    const response = await request(app)
      .post('/users')
      .send(user);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe(`The user ${user.firstName} ${user.lastName} was successfully created.`);

    const response2 = await request(app)
      .post('/users/sessions')
      .send(userCredentials);
    expect(response2.statusCode).toBe(200);
    expect(JSON.parse(response2.text).auth).toBe(true);
    expect(jwt.verify(JSON.parse(response2.text).token, 'shhhhh').email).toBe(user.email);

    const body = {
      access_token: JSON.parse(response2.text).token
    };

    expect(jwt.verify(body.access_token, 'shhhhh').email).toBe(user.email);

    const response3 = await request(app)
      .get('/users')
      .query()
      .send(body);
    expect(response3.statusCode).toBe(200);
    expect(JSON.parse(response3.text).firstName).toBe(user.firstName);
    expect(JSON.parse(response3.text).lastName).toBe(user.lastName);
    expect(JSON.parse(response3.text).email).toBe(user.email);
  });

  it('should return invalid query value', async () => {
    const user = {
      firstName: 'rodrigo',
      lastName: 'videla',
      email: 'carpaza@wolox.com.ar',
      password: 'password99'
    };

    const body = {
      access_token:
        // eslint-disable-next-line max-len
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhcnBhemFAd29sb3guY29tLmFyIiwiaWF0IjoxNTYyMzYwMTQ2fQ.paL_6LPAcb6FNKWWjhDIC2KGnu39quJ53Yre2gQrqvg'
    };

    const response = await request(app)
      .post('/users')
      .send(user);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe(`The user ${user.firstName} ${user.lastName} was successfully created.`);

    const response2 = await request(app)
      .get('/users')
      .query({ page: -1, limit: 5 })
      .send(body);
    expect(response2.statusCode).toBe(200);
    expect(response2.text).toBe('Invalid query value');
  });

  it('should return success', async () => {
    const user = {
      firstName: 'rodrigo',
      lastName: 'videla',
      email: 'carpaza@wolox.com.ar',
      password: 'password99'
    };

    const body = {
      access_token:
        // eslint-disable-next-line max-len
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhcnBhemFAd29sb3guY29tLmFyIiwiaWF0IjoxNTYyMzYwMTQ2fQ.paL_6LPAcb6FNKWWjhDIC2KGnu39quJ53Yre2gQrqvg'
    };

    const response = await request(app)
      .post('/users')
      .send(user);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe(`The user ${user.firstName} ${user.lastName} was successfully created.`);

    const response2 = await request(app)
      .get('/users')
      .query({ page: 0, limit: 5 })
      .send(body);
    expect(response2.statusCode).toBe(200);
    expect(JSON.parse(response2.text)[0].firstName).toBe(user.firstName);
    expect(JSON.parse(response2.text)[0].lastName).toBe(user.lastName);
    expect(JSON.parse(response2.text)[0].email).toBe(user.email);
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

    const response = await request(app)
      .post('/users')
      .send(user);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe(`The user ${user.firstName} ${user.lastName} was successfully created.`);

    const response2 = await request(app)
      .post('/users/sessions')
      .send(userCredentials);
    expect(response2.statusCode).toBe(200);
    expect(JSON.parse(response2.text).auth).toBe(true);
    expect(jwt.verify(JSON.parse(response2.text).token, 'shhhhh').email).toBe(user.email);
  });
});
