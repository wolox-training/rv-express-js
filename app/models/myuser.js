'use strict';
module.exports = (sequelize, DataTypes) => {
  const myUser = sequelize.define(
    'myUser',
    {
      ID: DataTypes.STRING,
      FirstName: DataTypes.STRING,
      LastName: DataTypes.STRING,
      Email: DataTypes.STRING,
      Contrasenia: DataTypes.STRING
    },
    {}
  );

  myUser.associate = models => {
    // associations can be defined here
  };

  return myUser;
};
