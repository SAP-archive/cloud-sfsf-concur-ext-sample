'use strict';

const data = require('../backend/data');

/**
 * List users
 * returns the users from SuccessFactors that have expenses associated with them.
 *
 * returns List
 **/
exports.getUsers = function() {
  return new Promise(function(resolve, reject) {
      data.userData()
          .then(function(result) {
              resolve(result);
          })
          .catch(function(error) {
              reject(error);
          });

  });
};

