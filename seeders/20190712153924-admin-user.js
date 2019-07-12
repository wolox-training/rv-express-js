'use strict';

const { encryptPassword } = require('../app/helpers/encryption');
const mySuperPassword = 'mySuperPassword';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'users',
      [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@wolox.com.ar',
          password: encryptPassword(mySuperPassword),
          privilegeLevel: 'admin',
          createdAt: '2016-06-22 19:10:25-07',
          updatedAt: '2016-06-22 19:10:25-07'
        }
      ],
      {}
    ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('users')
};
