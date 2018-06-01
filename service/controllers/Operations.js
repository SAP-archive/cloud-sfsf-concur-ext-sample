'use strict';

var utils = require('../utils/writer.js');
var operations = require('../service/OperationsService');

module.exports.getStatus = function getStatus (req, res, next) {
  operations.status()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.reloadDB = function reloadDB (req, res, next) {
  operations.downloadData()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
