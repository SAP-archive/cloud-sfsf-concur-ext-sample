'use strict';

/***
 * Our library to make asychronous requests. We use the
 * eachSeries method to iterate over users to get the reports
 */
const async = require('async');

/***
 * Our HTTP client lib that uses promises and not callbacks
 * because this is the 21st centuary
 *
 */
const got = require('got');

/***
 * These are the REST URL's to access SuccessFactors
 *
 * We use the API_KEY to get access to the SFSF API in
 * the API Hub.
 *
 * We use the JobApplicationInterview API to get a list of candidates
 * that have been interviewed. The interview object includes navigation links
 * to the actual job requisition and the job application
 *
 * We expand the requisition and application links and then we extract some of the fields
 * for the candidate and job to work out the department, division, location, country to bill
 * the costs to.
 *
 * We assume the candidate has submitted expenses for the role via concur with their candidateID as the employeeId in
 * concur. The expenses for each candidate are then summerized into the relevant departments, division and location
 * to highlight recruitment expenditure.
 */

const SFSF_URI = 'https://sandbox.api.sap.com/successfactors/odata/v2/JobApplicationInterview';
const ODATA_EXPAND = 'jobRequisition,jobApplication';
const ODATA_SELECT = 'jobApplication/candidateId,jobApplication/firstName,jobApplication/lastName,jobApplication/contactEmail,' +
                     'jobRequisition/department,jobRequisition/division,jobRequisition/country,jobRequisition/location';

/***
 * Concur endpoints in the SAP API Business Hub
 *
 * @type {string}
 */
const CONCUR_REPORTS_ENDPOINT = 'https://sandbox.api.sap.com/concur/api/v3.0/expense/reports';
const CONCUR_USER_ENDPOINT = 'https://sandbox.api.sap.com/concur/api/v3.0/common/users';

/***
 * The helper function takes the SFSF OData data and extracts only the properties
 * we are interested in for a user. There is a substantial amount of additional data
 * that we discard as not being relevant.
 *
 * @param data the raw data from Successfactors
 * @returns {Array} the simplified user data
 * @private
 */
function  _extractSFSFUserProperties (data) {
    const simplifiedUsers = [];
    const users = data.d.results;

    console.log('*********** Extracting SFSF User properties');

    users.forEach(function (user) {
        const ja = user.jobApplication;
        const jr = user.jobRequisition;

        if (ja && jr && ja.candidateId) {
            const user = simplifiedUsers.find(function(u) { return u.userId === ja.candidateId; });

            if (!user) {
                const simplifiedUser = {
                    userId: ja.candidateId,
                    firstName: ja.firstName || '',
                    lastName: ja.lastName || '',
                    email: ja.contactEmail || '',
                    country: jr.country || '',
                    location: jr.location || '',
                    department: jr.department || '',
                    division: jr.division || ''
                };

                simplifiedUsers.push(simplifiedUser);
            } else {
                console.log(`User ${ja.candidateId} is already in the candidates list`);
            }
        }
    });

    console.log('*********** Finished extracting properties');
    return simplifiedUsers;
}


/****
 * This helper function takes a collection of concur
 * reports and extracts only the fields we are interested in
 *
 * @param userId the SFSF userid of the report we are processing
 * @param loginId the Concur user Id of the report we are processing
 * @param data the data returned from concur when we ask for
 * the reports for a user
 * @returns {Array} the simplified report data
 *
 * @private
 */
function _extractConcurReportProperties (userId, loginId, data) {
    const simplifiedReports = [];
    const reports = data.Items;

    console.log('*********** Extracting Concur properties');

    reports.forEach(function (report) {

        const simplifiedReport = {
            id: report.ID,
            userId: userId,    // the SFSF user id
            loginId: loginId,  // the Concur login id
            owner: report.OwnerLoginID,
            name: report.Name,
            approvalStatus: report.ApprovalStatusCode,
            paymentStatus: report.PaymentStatusCode,
            total: report.Total,
            totalClaimed: report.TotalClaimedAmount,
            totalApproved: report.TotalApprovedAmount,
            currencyCode: report.CurrencyCode,
            created: new Date(report.CreateDate)
        };

        simplifiedReports.push(simplifiedReport);
    });

    return simplifiedReports;
}

/***
 * Gets the API key needed by the API hub to access the API hub
 * services. This is stored in an environment variable.
 *
 * As this is specfic to the
 * @returns {*}
 * @private
 */
function _getAPIKey () {
    if (!process.env.BUSINESS_HUB_API_KEY) {
        console.error('The SAP API Hub key is missing,please set it in the manifest file');
        process.abort(-1);
    }

    return process.env.BUSINESS_HUB_API_KEY;
}

/***
 * Converts the SFSF userid property into a Concur LoginId
 * With the login id it will be possible to retrieve the reports
 * for this SFSF user.
 *
 * If there is an error the promise is rejected with the error
 *
 * @param SFSFUserId The SFSF user id to convert to a concur LoginId
 * @returns {Promise}
 *
 * @private
 */
function _getConcurIdForSFSFUser (SFSFUserId) {

    return new Promise(function (resolve, reject) {
        const url = CONCUR_USER_ENDPOINT + '?EmployeeID=' + SFSFUserId;
        const options = {
            headers: {
                'apikey': _getAPIKey(),
                'Accept': 'application/json'
            },
            json: true
        };

        console.log(`Getting Concur Login Id from SFSF Id ${SFSFUserId}`);

        got.get(url, options)
            .then(function (response) {
                const data = response.body;

                if (data.Items.length > 1) {
                    // the user API endpoint for Concur will return partial matches for the EmployeeID
                    // so for example if we asked for employee ID 12 it would return user records for
                    // 121, 122, 123,124, 1211, 1222 etc. To fix this we look through all the matching
                    // users and find the exact employee id
                    const user = data.Items.find(function(u) {
                        return u.EmployeeID === SFSFUserId;
                    });

                    if (!user) {
                        console.error(`SFSF UserId ${SFSFUserId} maps to ${JSON.stringify(data.Items)} SFSF user accounts but not exactly`);
                        reject(new Error(`SFSF user ${SFSFUserId} maps to multiple Concur Accounts`));
                        return;
                    }
                    // force the user to index 0 so that the fall through handles it correctly.
                    data.Items[0] = user;
                }

                if (data.Items.length === 0) {
                    console.error(`SFSF UserId ${SFSFUserId} was not found in concur`);
                    reject(new Error(`No account mapping for ${SFSFUserId}`));
                    return;
                }

                const concurLoginId = data.Items[0].LoginID;
                console.log(`Mapped SFSF user ${SFSFUserId} to Concur Login Id ${concurLoginId}`);

                resolve(concurLoginId);
            })
            .catch(function (error) {
                console.error(`Error getting concur ID for ${options.uri} (${SFSFUserId})`);
                console.error(JSON.stringify(error, null, 2));

                reject(error);
            });
    });
}

/***
 * Gets the report for the specified concur login id
 * We get the reports using the query API introduced in the
 * V3 API for concur
 *
 * If there is an error the promise is rejected with the error
 *
 * @param loginId the Concur employee id
 *  @param userId the SFSF user id
 * @returns {Promise}
 *
 * @private
 */
function _getConcurReport (userId, loginId) {
    return new Promise(function (resolve, reject) {
        const url = CONCUR_REPORTS_ENDPOINT + '?user=' + loginId;
        const options = {
            headers: {
                'apikey': _getAPIKey(),
                'Accept': 'application/json'
            },
            json: true
        };

        console.log(`********** Fetching reports for ${loginId}`);

        got.get(url, options)
            .then(function onSuccess (response) {
                const data = response.body;

                const reports = _extractConcurReportProperties(userId, loginId, data);

                resolve(reports);
            })
            .catch(function onError (error) {
                console.error(`Error getting concur report for ${options.uri} (${loginId})`);
                reject(error);
            });
    });
}

/***
 * The function loads the reports from concur.
 * It uses the current user list in the db object (which was loaded from SuccessFactors
 *
 * First of all we take the SFSF userid and then map it to a concur EmployeeID and then
 * retrieve the reports for that user
 *
 * The request object is then completed with a reports object that has as the keys the SFSF
 * userid and the values as the reports for that user
 *
 * If there is an error the promise is rejected with the error
 *
 * @param userIdsMap
 * @returns {Promise}
 * @private
 */
function _loadReports (userIdsMap) {

    return new Promise(function (resolve, reject) {

        let reports = [];

        // we load the reports for each user
        async.eachSeries(userIdsMap,
            function eachUser (idMap, callback) {

                _getConcurReport(idMap.userId, idMap.loginId)
                    .then(function (userReports) {
                        // save the report object and tell the async library to process the next user
                        reports = reports.concat(userReports);
                        callback();
                    })
                    .catch(function (error) {
                        callback(error);
                    });
            },
            function onCompleted (error) {
                // when the series has finished processing
                // this function will always be called. If there was an error
                // then the promise will be rejected otherwise it will be
                // completed with the reports variable which is held at the closure
                // scope.
                if (error) {
                    reject(error);
                } else {
                    resolve(reports);
                }

            });
    });
}

/***
 * Load the SFSF users from SuccessFactors.
 *
 * Because we do not require all the properties of a user
 * that is in successfactors we then extract only the relevant
 * properties
 *
 * The full list of SFSF users we get is specified in the ODATA_EXPAND
 * string. At the moment it is hard coded to make it easier to only
 * extract some of the 600 users in SFSF.
 *
 * @returns {Promise}
 */
function loadSFSFUsersImpl () {
    return new Promise(function (resolve, reject) {

        if (!_getAPIKey()) {
            console.error('There is NO API Key defined');
            reject(new Error('No API key was found, unable to access successfactors or concur'));
            return;
        }

        const url = SFSF_URI;
        const options = {
            query: {
                $expand: ODATA_EXPAND,
                $select: ODATA_SELECT
            },
            headers: {
                'apikey': _getAPIKey(),
                'Accept': 'application/json'
            },
            json: true
        };

        got.get(url, options)
            .then(function onSuccess (response) {
                const data = response.body;
                console.log('*********** Got SFSF users:');

                const SFSFUsers = _extractSFSFUserProperties(data);

                resolve(SFSFUsers);
            })
            .catch(function onError (err) {
                console.error(`*********** Error retrieving SFSF users from\n ${SFSF_URI}?${ODATA_EXPAND}`);
                console.error(JSON.stringify(err, null, 2));
                reject(err);
            });
    });
}

/***
 * Loads the reports from and assigns them an SFSF user. We also only load the reports for the specified SFSF users.
 *
 * @param userIdsMap the array of {userId: loginId} where userId is the SFSF user id and loginId is the Concur loginId
 * @returns {Promise}
 */
function loadConcurReportsImpl (userIdsMap) {
    return new Promise(function (resolve, reject) {
        if (!_getAPIKey()) {
            console.error('There is NO API Key defined');
            reject(new Error('No API key was found, unable to access successfactors or concur'));
            return;
        }

        // we use the async library to iterate over all the loaded users
        // to first resolve the SFSF userId to a concur EmployeeId and
        // then get the reports for each employee id

        _loadReports(userIdsMap)
            .then(function (reports) {
                resolve(reports);
            })
            .catch(function onError (error) {
                console.error('Error retrieving reports');
                console.log(JSON.stringify(error, null, 2));
                reject(error);
            });
    });
}

function mapUserIdToLoginIdImpl (SFSFUserIds) {

    return new Promise(function (resolve, reject) {

        if (!_getAPIKey()) {
            console.error('There is NO API Key defined');
            reject(new Error('No API key was found, unable to access successfactors or concur'));
            return;
        }

        let ids = [];

        // we load the reports for each user
        async.eachSeries(SFSFUserIds,
            function eachUser (SFSFUserId, callback) {

                // we need to map the SFSF user to a concur employee id as the email addresss
                // can be different or even not valid addresses
                _getConcurIdForSFSFUser(SFSFUserId)
                    .then(function (loginId) {
                        ids.push({ userId: SFSFUserId, loginId: loginId });
                        callback();
                    })
                    .catch(function (error) {
                        callback();
                    });
            },
            function onCompleted (error) {
                // when the series has finished processing
                // this function will always be called. If there was an error
                // then the promise will be rejected otherwise it will be
                // completed with the reports variable which is held at the closure
                // scope.
                if (error) {
                    reject(error);
                } else {
                    resolve(ids);
                }

            });
    });
}

module.exports = {
    loadConcurReports: loadConcurReportsImpl,
    loadSFSFUsers: loadSFSFUsersImpl,
    mapUserIdToLoginId: mapUserIdToLoginIdImpl
};


