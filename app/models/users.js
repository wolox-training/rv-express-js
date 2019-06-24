import { sequelize } from '.';

// Aca creare el modelo de usuarios
const User = sequelize.define('user', {
  // Should i set the primaryKey atribute or not?
  ID: { type: sequelize.STRING, required: true, primaryKey: true, autoIncrement: true, unique: true },
  FirstName: { type: sequelize.STRING, required: true },
  LastName: { type: sequelize.STRING, required: true },
  Email: { type: sequelize.STRING, required: true },
  Contrasenia: { type: sequelize.STRING, required: true }
});

// - ID: requerido, único, auto incremental.
// - Nombre: requerido.
// - Apellido: requerido.
// - Email: requerido, único.
// - Contraseña: requerido.

module.exports = { User };
