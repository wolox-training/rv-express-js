/* eslint-disable no-unused-vars */
'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      FirstName: { type: DataTypes.STRING, required: true },
      LastName: { type: DataTypes.STRING, required: true },
      email: { type: DataTypes.STRING, required: true },
      password: { type: DataTypes.STRING, required: true }
    },
    {}
  );

  User.associate = models => {
    // associations can be defined here
  };

  return User;
};
