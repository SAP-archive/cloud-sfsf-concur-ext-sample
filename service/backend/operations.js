'use strict';

 /***
 * Our library for db access
 */
const db = require('./db');

const apiHub = require('./apihub');

const fs = require('fs');

/***
 * Set this property to log or not log payload bodies to the
 * console.
 *
 * @type {boolean} true to enable logging of reponse bodies and
 * false otherwise.
 *
 * @private
 */
const __LOG_DATA__ = false;

/***
 * The filename where we persist and restore data from.
 *
 * This is a JSON file holding the current database.
 *
 * @type {string}
 * @private
 */
const __DB_FILENAME__ = './.db.json';

/***
 * This method is used to download the data from the backend as a single operation
 * The grabs the data from SFSF and then merges this with the concur reports and
 * stores them in memory
 *
 * @returns {Promise}
 */
function downloadDataImpl () {
    return new Promise(function (resolve, reject) {

        console.log('Downloading SFSF & Concur data from API Management');

        const dbstatus = db.status();

        if (dbstatus === db.STATES.BUSY) {
            console.error('DB is reporting as busy');
            reject(new Error(`DB is loading - ${dbstatus}`));
            return;
        }

        db.setStatus(db.STATES.BUSY);

        apiHub.loadSFSFUsers()
            .then(function (SFSFUsers) {
                console.log('*********** Loaded users into DB');
                if (__LOG_DATA__) {
                    console.log(JSON.stringify(SFSFUsers, null, 2));
                }

                db.setSFSFUsers(SFSFUsers);

                const ids = [];
                SFSFUsers.forEach(function (user) {
                    ids.push(user.userId);
                });

                return apiHub.mapUserIdToLoginId(ids);
            })
            .then(function (userIdsMap) {
                return apiHub.loadConcurReports(userIdsMap);
            })
            .then(function (reports) {
                console.log('************* Loaded Concur reports');
                if (__LOG_DATA__) {
                    console.log(JSON.stringify(reports,null, 2));
                }

                db.setConcurReports(reports);
                db.setLastSync(new Date());

                console.log('************* Loaded data from API Management');

                return persistDataImpl();
            })
            .then( function () {
                console.log('************* Wrote data to file');

                db.setStatus(db.STATES.IDLE);
                resolve();
            })
            .catch(function (error) {
                console.error('*********** Unable to loading data from backend');
                console.error(JSON.stringify(error, null, 2));

                db.setStatus(db.STATES.IDLE);

                reject(error);
            });
    });
}

/***
 * Reads the data from the file that is stored in the config directory
 *
 * @returns {Promise}
 */
function restoreDataImpl () {
    return new Promise(function (resolve, reject) {
        console.log(`Loading current state from ${__DB_FILENAME__}`);

        db.setStatus(db.STATES.INITIALIZING);

        fs.readFile(__DB_FILENAME__, 'utf8', function (err, data) {
            if (err) {
                // check if the error is that the file does not exist
                if (err.code !== 'ENOENT') {
                    console.error('Error checking for DB File');
                    console.error(JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    console.warn('The DB file does not exist which is okay');
                    resolve(true);
                }
                return;
            }

            const dbData = JSON.parse(data, function (key, value) {
                if (key === 'bootTime' || key === 'lastSync') {
                    return new Date(value);
                }

                return value;
            });

            db.write(dbData)
                .then( function () {
                    db.setStatus(db.STATES.IDLE);
                    resolve();
                })
                .catch(function (error) {
                    console.error('Error reading data');
                    console.error(JSON.stringify(error, null, 2));
                    reject(error);
                });
        });
    });
}

/***
 * Stores the current DB into the config folder
 *
 * @returns {Promise}
 */
function persistDataImpl () {
    return new Promise(function (resolve, reject) {

        console.log(`Storing current state to ${__DB_FILENAME__}`);
        db.read()
            .then( function (state) {
                state.bootTime = state.bootTime.toISOString();
                state.lastSync = state.lastSync.toISOString();

                const fileData = JSON.stringify(state, null, 2);

                fs.writeFile(__DB_FILENAME__, fileData, function (error) {
                    if (error) {
                        console.error('Error storing file');
                        console.error(JSON.stringify(error));
                        reject(error);
                        return;
                    }

                    console.log(`Successfully saved the data to file ${__DB_FILENAME__}`);
                    resolve();
                });
            })
            .catch(function (error) {
                console.error('Error writing data');
                console.error(JSON.stringify(error, null, 2));
                reject(error);
            });
    });
}

function statusImpl() {
    return new Promise(function (resolve) {
        const dbStatus = db.status();
        const now = new Date();
        const bootTime = db.bootTime();
        const lastSync = db.lastSync();
        const diffMS = (now.getTime() - bootTime.getTime()) * 1000; // in seconds

        const status = {
            services: 'ok',
            database: dbStatus,
            uptime: diffMS,
            lastsync: lastSync.toISOString()
        };

        resolve(status);
    });
}

module.exports = {
    status: statusImpl,
    downloadData: downloadDataImpl,
    persistData: persistDataImpl,
    restoreData: restoreDataImpl
}
