const { encryptPassword } = require('../helpers/encryption');

const regexAlphanumeric = /^[a-zA-Z0-9]*$/;
// eslint-disable-next-line no-useless-escape
const regexValidEmail = /^([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)@wolox.com.ar$/;

const isPasswordLenghtvalid = password => {
  if (password.length < 8) {
    return false;
  }
  return true;
};

const isPasswordAlphanumeric = password => {
  if (!regexAlphanumeric.test(password)) {
    return false;
  }
  return true;
};

const isEmailValid = email => {
  if (!regexValidEmail.test(email)) {
    return false;
  }
  return true;
};

const isUserValid = user => {
  const { email, password } = user;

  if (!isPasswordLenghtvalid(password)) {
    user.status = 'Password too short!';
    return false;
  }

  if (!isPasswordAlphanumeric(password)) {
    user.status = 'Password is not alphanumeric!';
    return false;
  }

  user.password = encryptPassword(password);

  if (!isEmailValid(email)) {
    user.status = 'Email not valid!';
    return false;
  }

  return true;
};

module.exports = { isUserValid };
