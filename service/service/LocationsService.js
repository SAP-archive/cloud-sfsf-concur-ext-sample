'use strict';

const data = require('../backend/data');

/**
 * List the expenses by locations
 * returns the expenses by locations
 *
 * returns List
 **/
exports.getExpensesByLocation = function() {
    return new Promise(function(resolve, reject) {
        data.totals('location')
            .then(function(result) {
                resolve(result);
            })
            .catch(function(error) {
                reject(error);
            });
    });
};

