'use strict';

var utils = require('../utils/writer.js');
var Reports = require('../service/ReportsService');

module.exports.getReports = function getReports (req, res, next) {
  Reports.getReports()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
