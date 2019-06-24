/* eslint-disable no-unused-vars */
'use strict';
module.exports = (sequelize, DataTypes) => {
  const myUser = sequelize.define(
    'myUser',
    {
      ID: { type: DataTypes.STRING, required: true, primaryKey: true, autoIncrement: true, unique: true },
      FirstName: { type: DataTypes.STRING, required: true },
      LastName: { type: DataTypes.STRING, required: true },
      Email: { type: DataTypes.STRING, required: true },
      Contrasenia: { type: DataTypes.STRING, required: true }
    },
    {}
  );

  myUser.associate = models => {
    // associations can be defined here
  };

  return myUser;
};
