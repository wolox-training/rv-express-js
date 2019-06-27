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

const { getAllUsers } = require('../app/controllers/usersController');

describe('#addUser()', () => {
  it('should add an user to the table', () => {
    console.log('hola, gente');
    console.log(getAllUsers());
    // addUser();
    expect(myBeverage.delicious).toBeTruthy();
  });
});
