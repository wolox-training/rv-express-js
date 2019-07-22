/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
const faker = require('faker');
const { sendMail } = require('../app/helpers/mailHelper');

describe('welcome email test', () => {
  const email = `${faker.name.lastName()}@wolox.com.ar`;
  const regExToMatch = /Message sent: <(.*)@wolox.com.ar>/;

  it('should return with a welcome email', async () => {
    const result = await sendMail(email);
    expect(result).toMatch(regExToMatch);
  });
});
