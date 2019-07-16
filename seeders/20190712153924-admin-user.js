'use strict';

const { encryptPassword } = require('../app/helpers/encryption');
const mySuperPassword = 'mySuperPassword';

module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert(
      'users',
      [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@wolox.com.ar',
          password: encryptPassword(mySuperPassword),
          privilege_level: 'admin',
          createdAt: '2016-06-22 19:10:25-07',
          updatedAt: '2016-06-22 19:10:25-07'
        }
      ],
      {}
    ),

  down: queryInterface => queryInterface.bulkDelete('users')
};
