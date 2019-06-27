/* eslint-disable no-unused-vars */
'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      firstName: { type: DataTypes.STRING, allowNull: false /* , field: 'first_name'*/ },
      lastName: { type: DataTypes.STRING, allowNull: false /* , field: 'last_name'*/ },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false }
    },
    {
      // underscored: true
      tableName: 'users'
    }
  );

  User.associate = models => {
    // associations can be defined here
  };

  return User;
};
