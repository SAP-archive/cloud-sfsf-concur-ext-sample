'use strict';

var utils = require('../utils/writer.js');
var Divisions = require('../service/DivisionsService');

module.exports.getExpensesByDivision = function getExpensesByDivision (req, res, next) {
  Divisions.getExpensesByDivision()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
