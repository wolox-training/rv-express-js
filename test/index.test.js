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

describe('Password length test', () => {
  const req = {
    body: {
      firstName: 'rodrigo',
      lastName: 'videla',
      email: 'rodrigo.videla@wolox.com.ar',
      password: 'asffh'
    }
  };

  const res = {
    k_status: null,
    k_send: null,
    status(string) {
      this.k_status = string;
      console.log(string);
      return this;
    },
    send(string) {
      this.k_send = string;
      console.log(string);
      return this;
    }
  };

  beforeEach(() => addUser(req, res));

  it('should return password length invalid', () => {
    expect(res.k_send).toBe('The user rodrigo videla was successfully created.');
    return obtainAllUsers().then(result => {
      console.log(`I print the results ${result[0].firstName}`);
      console.log(`I print the results ${result[0].lastName}`);
      console.log(`I print the results ${result[0].password}`);
      console.log(`I print the results ${result[0].email}`);
    });
  });
});

describe('Password alphanumeric test', () => {
  const req = {
    body: {
      firstName: 'rodrigo',
      lastName: 'videla',
      email: 'rodrigo.videla@wolox.com.ar',
      password: 'as!ddh'
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

  beforeEach(() => addUser(req, res));

  it('should return password not alphanumeric', () => {
    obtainAllUsers().then(result => console.log(result));
  });
});

describe('Valid email test', () => {
  const req = {
    body: {
      firstName: 'rodrigo',
      lastName: 'videla',
      email: 'rodrigo.videla@woflox.com.ar',
      password: 'asasdfasfdddh'
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

  beforeEach(() => addUser(req, res));

  it('should return email not valid', () => {
    obtainAllUsers().then(result => console.log(result));
  });
});

describe('Password alphanumeric test', () => {
  // 'should return email not valid'
  // 'should return email already in the database'

  const req = {
    body: {
      firstName: 'rodrigo',
      lastName: 'videla',
      email: 'rodrigo.videla@wolox.com.ar',
      password: 'asddhdhdhsgf'
    }
  };
  // const user = req.body;

  const req2 = {
    body: {
      firstName: 'rodrigo',
      lastName: 'videla',
      email: 'rodrigo.videla@wolox.com.ar',
      password: 'asddhdhdhsgf'
    }
  };
  // const user2 = req2.body;

  // const req3 = {
  //   body: {
  //     firstName: 'rodrigo',
  //     lastName: 'videla',
  //     email: 'rodrigo.vidffela@wolox.com.ar',
  //     password: 'asddhdhdhsgf'
  //   }
  // };
  // const user3 = req3.body;

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

  // beforeEach(() => {
  //   // registerUser(user).then(() => {
  //   //   console.log('usuario registrado');
  //   //   done();
  //   // });
  //   return addUser(req, res).then(console.log('usuario registrado'));

  //   // done();
  // });

  beforeEach(() =>
    addUser(req, res).then(() => {
      console.log('usuario1 registrado');
      return addUser(req2, res).then(console.log('usuario2 registrado'));
    })
  );

  // addUser(req3, res);

  // obtainAllUsers().then(result => {
  //   console.log('obteniendo usuarios');
  //   console.log(req.body.password);
  //   addUser(req, res);
  //   console.log(req.body.password);
  //   console.log(result);
  //   done();
  // });

  //   expect(myBeverage.delicious).toBeTruthy();
  //   console.log('holaasfad');
  // });

  it('should return password length invalid', done => {
    console.log('gp;a');
    obtainAllUsers().then(result => {
      // console.log('obteniendo usuarios');
      // console.log(req.body.password);
      // addUser(req, res);
      // console.log(req.body.password);
      console.log(result);
      done();
    });
  });
});
