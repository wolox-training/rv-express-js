/* eslint-disable no-unused-vars */
'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserAlbums = sequelize.define(
    'UserAlbums',
    {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
      externalReferenceId: { type: DataTypes.INTEGER, allowNull: false, field: 'external_reference_id' }
    },
    {
      tableName: 'users'
    }
  );

  UserAlbums.associate = models => {
    // associations can be defined here
  };
  return UserAlbums;
};
