const { ALBUMS_API_URL } = process.env || {};
const { JWT_EXPIRATION_TIME } = process.env || {};
const { AUTH_USER } = process.env || {};
const { AUTH_CLIENT_ID } = process.env || {};
const { AUTH_CLIENT_SECRET } = process.env || {};
const { AUTH_REFRESH_TOKEN } = process.env || {};
const { AUTH_ACCESS_TOKEN } = process.env || {};

module.exports = {
  ALBUMS_API_URL,
  JWT_EXPIRATION_TIME,
  AUTH_USER,
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,
  AUTH_REFRESH_TOKEN,
  AUTH_ACCESS_TOKEN
};
