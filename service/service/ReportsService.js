'use strict';

const data = require('../backend/data');

/**
 * List reports for the users
 * returns the reports for the users that are stored in the system.
 *
 * returns List
 **/
exports.getReports = function() {
  return new Promise(function(resolve, reject) {
      data.reportData()
          .then(function(result) {
              resolve(result);
          })
          .catch(function(error) {
              reject(error);
          });
  });
};

