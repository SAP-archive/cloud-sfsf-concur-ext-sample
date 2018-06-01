'use strict';

const data = require('../backend/data');

/**
 * List the expenses by countries
 * returns the expenses by countries
 *
 * returns List
 **/
exports.getExpensesByCountry = function() {
    return new Promise(function(resolve, reject) {
        data.totals('country')
            .then(function(result) {
                resolve(result);
            })
            .catch(function(error) {
                reject(error);
            });
    });
};

