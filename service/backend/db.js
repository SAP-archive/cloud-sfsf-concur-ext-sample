'use strict';

const DB_STATES =  {
    IDLE: 'idle',
    UNINITIALIZED: 'uninitialized',
    INITIALIZING: 'initializing',
    BUSY: 'busy'
};

const defaultState = {
    status: DB_STATES.UNINITIALIZED,
    bootTime: new Date(),
    lastSync: new Date(0),
    SFSFUsers: [],
    concurReports: []
};

let state = Object.assign({}, defaultState);


function getBootTime () {
    return state.bootTime;
}

function getStatus () {
    return state.status;
}

function setStatus (newStatus) {
    state.status = newStatus;

}

function getLastSyncTime () {
    return state.lastSync;
}

function setLastSync (dt) {
    state.lastSync = dt;
}


function getSFSFUsers () {
    return new Promise(function (resolve, reject) {

        if (state.SFSFUsers.length) {
            resolve(state.SFSFUsers);
        } else {
            reject(new Error('The SFSF users collection is empty - did you call refresh'));
        }
    });
}

function setSFSFUsers (userData) {
    return new Promise(function (resolve) {
        const duplicateUsers = [];
        userData.forEach(function (user) {
            duplicateUsers.push(Object.assign({}, user));
        });

        state.SFSFUsers = duplicateUsers;
        resolve();
    });
}

function getConcurReports () {
    return new Promise(function (resolve, reject) {
        if (state.concurReports.length) {
            resolve(state.concurReports);
        } else {
            reject(new Error('The Concur report collection is empty - did you call refresh'));
        }
    });
}

function setConcurReports (reportData) {
    return new Promise(function (resolve) {
        const duplicateReports = [];
        reportData.forEach(function (report) {
            duplicateReports.push(Object.assign({}, report));
        });

        state.concurReports = duplicateReports;
        resolve();
    });
}

function getState () {
    return new Promise(function (resolve) {
        const duplicateState = Object.assign({}, state);
        resolve(duplicateState);
    });
}

function setState (newState) {
    return new Promise(function (resolve) {
        state = Object.assign({}, newState);
        resolve();
    });
}

function getDefaultState () {
    return defaultState;
}

module.exports = {
    STATES: DB_STATES,
    bootTime: getBootTime,
    lastSync: getLastSyncTime,
    setLastSync: setLastSync,
    status: getStatus,
    setStatus: setStatus,
    SFSFUsers: getSFSFUsers,
    setSFSFUsers: setSFSFUsers,
    ConcurReports: getConcurReports,
    setConcurReports: setConcurReports,
    read: getState,
    write: setState,
    defaultState: getDefaultState
};
