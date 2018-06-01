'use strict';

var utils = require('../utils/writer.js');
var Locations = require('../service/LocationsService');

module.exports.getExpensesByLocation = function getExpensesByLocation (req, res, next) {
  Locations.getExpensesByLocation()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
