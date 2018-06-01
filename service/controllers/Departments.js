'use strict';

var utils = require('../utils/writer.js');
var Departments = require('../service/DepartmentsService');

module.exports.getExpensesByDepartment = function getExpensesByDepartment (req, res, next) {
  Departments.getExpensesByDepartment()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
