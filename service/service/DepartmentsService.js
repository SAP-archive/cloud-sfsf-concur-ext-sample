'use strict';

const data = require('../backend/data');

/**
 * List the expenses by department
 * returns the expenses by department
 *
 * returns List
 **/
exports.getExpensesByDepartment = function() {
  return new Promise(function(resolve, reject) {
      data.totals('department')
          .then(function(result) {
              resolve(result);
          })
          .catch(function(error) {
             reject(error);
          });
  });
};


