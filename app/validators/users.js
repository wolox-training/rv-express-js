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
  if (regexAlphanumeric.test(password) === false) {
    return false;
  }
  return true;
};

const isEmailValid = email => {
  if (regexValidEmail.test(email) === false) {
    return false;
  }
  return true;
};

module.exports = { isPasswordAlphanumeric, isPasswordLenghtvalid, isEmailValid };
