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

describe('#addUser()', () => {
  it('should return password length invalid', () => {
    // 'should return password not alphanumeric'
    // 'should return email not valid'

    const req = {
      body: {
        firstName: 'rodrigo',
        lastName: 'videla',
        email: 'rodrigo.videla@wolox.com.ar',
        password: 'asdfhhdff'
      }
    };

    const res = {
      status(string) {
        console.log(string);
        return this;
      },
      send(string) {
        console.log(string);
        return this;
      }
    };

    addUser(req, res);

    // let hola = null;

    obtainAllUsers().then(result => {
      console.log('hola');
      // hola = result;
      console.log(result);
    });
    expect(myBeverage.delicious).toBeTruthy();
  });
});
