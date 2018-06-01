'use strict';

const operations = require('../backend/operations');

/**
 * Check app status
 * Gets the system status.
 *
 * returns Status
 **/
function statusImpl() {
  return new Promise(function(resolve, reject) {

      operations.status()
          .then(function(status) {
              resolve(status);
          })
          .catch(function(error) {
              reject(error);
          })
  });
}



/**
 * Refresh the Data
 * Refreshes the database by getting the data from Concur and from SuccessFactors and merging it to build an aggregate view of the expenses in the organization.
 *
 * no response value expected for this operation
 **/
function downloadDataImpl() {
    return new Promise(function(resolve, reject) {
        operations.downloadData()
            .then(function() {
                resolve();
            })
            .catch(function(error) {
                reject(error);
            })
    });
}

module.exports = {
    status: statusImpl,
    downloadData: downloadDataImpl
};

