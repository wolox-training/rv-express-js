/* eslint-disable prefer-promise-reject-errors */

const request = require('request');
exports.request = options => {
  return new Promise((resolve, reject) => {
    request[options.method](options, (error, response) => {
      if (error) {
        console.log({ ...error, ...options });
        return reject({ statusCode: 500, message: error.message });
      }
      console.log({
        status: response.statusCode,
        url: options.url,
        method: options.method,
        params: options.qs,
        body: response.body
      });
      if (response.statusCode < 200 || response.statusCode > 299) {
        return reject({ statusCode: response.statusCode, message: response.body });
      }
      return resolve(response);
    });
  });
};
