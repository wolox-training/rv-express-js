/* eslint-disable max-len */
describe('first test', () => {
  test('first test', () => {
    expect(3).toEqual(3);
  });
});

const myBeverage = {
  delicious: true,
  sour: false
};

describe('my beverage', () => {
  test('is delicious', () => {
    expect(myBeverage.delicious).toBeTruthy();
  });

  test('is not sour', () => {
    expect(myBeverage.sour).toBeFalsy();
  });
});

test('null', () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});

const { obtainAllUsers } = require('../app/services/users');
const { addUser } = require('../app/controllers/usersController');

const res = {
  k_status: null,
  k_send: null,
  status(string) {
    this.k_status = string;
    return this;
  },
  send(string) {
    this.k_send = string;
    return this;
  }
};

describe('Adds user to the database', () => {
  const req = {
    body: {
      firstName: 'rodrigo',
      lastName: 'videla',
      email: 'rodrigo.videla@wolox.com.ar',
      password: 'addddddsffh'
    }
  };

  beforeEach(() => addUser(req, res));

  it('should add user correctly to the database', () => {
    expect(res.k_send).toBe(`The user ${req.body.firstName} ${req.body.lastName} was successfully created.`);
    return obtainAllUsers({ where: { email: req.body.email } }).then(result => {
      expect(result[0].email).toBe(req.body.email);
    });
  });
});

describe('Password length test', () => {
  const req = {
    body: {
      firstName: 'rodrigo',
      lastName: 'videla',
      email: 'rodrigo.videla@wolox.com.ar',
      password: 'addd'
    }
  };

  beforeEach(() => addUser(req, res));

  it('should return password length invalid', () => {
    expect(res.k_send.error).toBe(
      `The input user data: ${req.body.firstName} ${req.body.lastName} ${req.body.email} is not valid: Password too short!`
    );

    return obtainAllUsers({ where: { email: req.body.email } }).then(result => {
      expect(result[0]).toBeUndefined();
      // console.log(result);
    });
  });
});

describe('Password alphanumeric test', () => {
  const req = {
    body: {
      firstName: 'rodrigo',
      lastName: 'videla',
      email: 'rodrigo.videla@wolox.com.ar',
      password: 'addd!dddsffh'
    }
  };

  beforeEach(() => addUser(req, res));

  it('should return password not alphanumeric', () => {
    expect(res.k_send.error).toBe(
      `The input user data: ${req.body.firstName} ${req.body.lastName} ${req.body.email} is not valid: Password is not alphanumeric!`
    );
    return obtainAllUsers({ where: { email: req.body.email } }).then(result => {
      expect(result[0]).toBeUndefined();
    });
  });
});

describe('Valid email test', () => {
  const req = {
    body: {
      firstName: 'rodrigo',
      lastName: 'videla',
      email: 'rodrigo.videla@woflox.com.ar',
      password: 'addddddsffh'
    }
  };

  beforeEach(() => addUser(req, res));

  it('should return email not valid', () => {
    expect(res.k_send.error).toBe(
      `The input user data: ${req.body.firstName} ${req.body.lastName} ${req.body.email} is not valid: Email not valid!`
    );
    return obtainAllUsers({ where: { email: req.body.email } }).then(result => {
      expect(result[0]).toBeUndefined();
    });
  });
});
