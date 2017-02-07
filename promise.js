'use strict';

const argsert = require('./');

module.exports = function argsertPromise () {
  const allArgs = arguments;
  return new Promise((resolve, reject) => {
    try {
      return resolve(argsert(...allArgs));
    } catch (err) {
      return reject(err);
    }
  });
};
