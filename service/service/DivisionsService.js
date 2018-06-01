'use strict';

const data = require('../backend/data');

/**
 * List the expenses by division
 * returns the expenses by division
 *
 * returns List
 **/
exports.getExpensesByDivision = function() {
    return new Promise(function(resolve, reject) {
        data.totals('division')
            .then(function(result) {
                resolve(result);
            })
            .catch(function(error) {
                reject(error);
            });
    });
};

