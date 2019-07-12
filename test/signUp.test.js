/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
const app = require('../app');
const request = require('supertest');
const { obtainAllUsers } = require('../app/services/users');
const { factory } = require('factory-girl');
const faker = require('faker');

describe('Sign Up endpoint test', () => {
  function User() {
    this.firstName = faker.name.firstName();
    this.lastName = faker.name.lastName();
    this.email = `${faker.name.lastName()}@wolox.com.ar`;
    this.password = factory.chance('word', { length: 8 })();
  }

  afterEach(() => factory.cleanUp());

  it('should add user correctly to the database', async () => {
    const user = new User();
    const response = await request(app)
      .post('/users')
      .send(user);
    expect(response.text).toBe(`The user ${user.firstName} ${user.lastName} was successfully created.`);
    expect(response.statusCode).toBe(200);

    const userResult = await obtainAllUsers({ where: { email: user.email } });
    expect(userResult[0].email).toBe(user.email);
  });

  it('should return password length invalid', async () => {
    const user = new User();
    user.password = factory.chance('word', { length: 7 })();

    const response = await request(app)
      .post('/users/')
      .send(user);

    expect(response.text).toBe(
      `{\"error\":\"The input user data: ${user.firstName} ${user.lastName} ${user.email} is not valid: Password too short!\"}`
    );
    expect(response.statusCode).toBe(500);
  });

  it('should return password not alphanumeric', async () => {
    const user = new User();
    user.password = 'passw!word99';

    const response = await request(app)
      .post('/users/')
      .send(user);
    expect(response.text).toBe(
      `{\"error\":\"The input user data: ${user.firstName} ${user.lastName} ${user.email} is not valid: Password is not alphanumeric!\"}`
    );
    expect(response.statusCode).toBe(500);
  });

  it('should return email not valid', async () => {
    const user = new User();
    user.email = 'rodrigo.videla@woflox.com.ar';

    const response = await request(app)
      .post('/users/')
      .send(user);
    expect(response.text).toBe(
      `{\"error\":\"The input user data: ${user.firstName} ${user.lastName} ${user.email} is not valid: Email not valid!\"}`
    );
    expect(response.statusCode).toBe(500);
  });
});
