'use strict';

var utils = require('../utils/writer.js');
var Totals = require('../service/TotalsService');

module.exports.getTotals = function getTotals (req, res, next) {
  Totals.getTotals()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
