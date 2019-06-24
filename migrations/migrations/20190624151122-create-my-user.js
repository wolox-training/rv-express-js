/* eslint-disable no-unused-vars */
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('myUsers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        required: true
      },
      FirstName: {
        type: Sequelize.STRING,
        required: true
      },
      LastName: {
        type: Sequelize.STRING,
        required: true
      },
      Email: {
        type: Sequelize.STRING,
        required: true
      },
      Password: {
        type: Sequelize.STRING,
        required: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('myUsers')
};
