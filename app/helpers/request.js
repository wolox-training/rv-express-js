/* eslint-disable prefer-promise-reject-errors */

const request = require('request');

exports.request = options =>
  new Promise((resolve, reject) => {
    request[options.method](options, (error, response) => {
      if (error) {
        return reject({ statusCode: 500, message: error.message });
      }
      if (response.statusCode < 200 || response.statusCode > 299) {
        return reject({ statusCode: response.statusCode, message: response.body });
      }
      return resolve(response);
    });
  });
