'use strict';

 /***
 * Our library for db access
 */
const db = require('./db');

const stringLib = require('../utils/stringlib');

const validAggregateFields = ['department', 'division', 'location', 'country'];

/***
 *
 * @param field - the field to be aggregated
 * @returns {Promise} - returns a promise fulfilled when it has calculated all the data
 */
function totalsByFieldImpl(field) {

    return new Promise(function(resolve, reject) {
        if (validAggregateFields.indexOf(field) === -1) {
            console.error(`${field} is not a valid field - valid fields are ${validAggregateFields.join()}`);
            reject(new Error('Invalid field to aggregate'));
            return;
        }

        if (db.status() !== db.STATES.IDLE) {
            console.error('DB is reporting as not idle');
            reject(new Error('DB is Busy'));
            return;
        }

        Promise.all([db.SFSFUsers(), db.ConcurReports()])
            .then(function (results) {
                const users = results[0];
                const reports = results[1];
                const totals = [];

                reports.forEach(function(r) {
                    const value = r.total;
                    const userId = r.userId;

                    const user = users.find(function(u) {
                        return u.userId === userId;
                    });

                    if (user) {
                        const uf = user[field];

                        const total = totals.find(function(t) {
                            return t[field] === uf;
                        });

                        if (total) {
                            total.count += 1;
                            total.total += value;
                        } else {
                            // [field] is a new thing for ES6
                            // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors
                            totals.push({[field]: uf, total: value, count: 1});
                        }

                    } else {
                        console.error('Unable to find user ${userId');
                    }
                });

                console.log(`Worked out totals for ${field}`);

                // now we split the object into a new object
                const final = totals.map(function(v) {
                    const {name, code } = stringLib.splitString(v[field]);
                    const value = stringLib.round(v.total);
                    const count = v.count;

                    return {
                        name: name,
                        code: code,
                        total: value,
                        count: count
                    };
                });

                console.log(`Resolving final layout for ${field}`);
                resolve(final || []);
            })
            .catch(function (error) {
                console.error('Unable to read SFSFUsers or Concur reports');
                console.error(JSON.stringify(error, null, 2));
                reject(error);
            });
    });
}

function reportDataImpl() {
    return new Promise(function (resolve, reject) {

        console.log('Fetching reports');

        if (db.status() === db.STATES.BUSY) {
            console.error('DB is reporting as busy');
            reject(new Error(`DB is loading`));
            return;
        }

        db.ConcurReports()
            .then( function (reports) {
                resolve(reports);
            })
            .catch( function (error) {
                reject(error);
            });
    });
}

function userDataImpl() {
    return new Promise(function (resolve, reject) {

        console.log('Fetching users');

        if (db.status() !== db.STATES.IDLE) {
            console.error('GetUsers - DB is reporting as busy');
            reject(new Error(`DB is loading`));
            return;
        }

        db.SFSFUsers()
            .then( function (users) {
                resolve(users);
            })
            .catch(function (error) {
                reject(error);
            });
    });
}

function summaryImpl() {
    return new Promise(function(resolve, reject) {
        Promise.all([totalsByFieldImpl('department'), totalsByFieldImpl('division'), totalsByFieldImpl('location'), totalsByFieldImpl('country')])
            .then(function (results) {
                const departments = results[0];
                const divisions = results[1];
                const locations = results[2];
                const country = results[3];

                let total = 0;

                departments.forEach(function(v) {
                    total += v.total;
                });

                divisions.forEach(function(v) {
                    total += v.total;
                });

                locations.forEach(function(v) {
                    total += v.total;
                });

                country.forEach(function(v) {
                    total += v.total;
                });

                const data = {
                    byDepartment: departments.length,
                    byDivision: divisions.length,
                    byLocation: locations.length,
                    byCountry: country.length,
                    grossTotal: stringLib.round(total)
                };

                console.log(`Totals: ${JSON.stringify(data, null, 2)}`);

                resolve(data);
            })
            .catch(function (reason) {
                reject(reason);
            });
    });
}


module.exports = {
    totals: totalsByFieldImpl,
    userData: userDataImpl,
    reportData: reportDataImpl,
    summary: summaryImpl
};
