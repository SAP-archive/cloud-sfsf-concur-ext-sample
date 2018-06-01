'use strict';

const data = require('../backend/data');

/**
 * List the total number of aggregates
 * returns total number of different countries, locations, divisions & departments
 *
 * returns Totals
 **/
exports.getTotals = function() {
    return new Promise(function(resolve, reject) {
        data.summary()
            .then(function(result) {
                resolve(result);
            })
            .catch(function(error) {
                reject(error);
            });
    });
};


