/* eslint-disable no-unused-vars */
'use strict';
module.exports = (sequelize, DataTypes) => {
  const myUser2 = sequelize.define(
    'myUser2',
    {
      FirstName: { type: DataTypes.STRING, required: true },
      LastName: { type: DataTypes.STRING, required: true },
      email: { type: DataTypes.STRING, required: true },
      password: { type: DataTypes.STRING, required: true }
    },
    {}
  );

  myUser2.associate = models => {
    // associations can be defined here
  };

  return myUser2;
};
