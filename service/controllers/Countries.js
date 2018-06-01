'use strict';

var utils = require('../utils/writer.js');
var Countries = require('../service/CountriesService');

module.exports.getExpensesByCountry = function getExpensesByCountry (req, res, next) {
  Countries.getExpensesByCountry()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
