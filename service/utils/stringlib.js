'use strict';

 const nameSplitterRegEx = /^(.*) \((.*)\)$/;
const unknownMarker = "--";

/***
 * rounds a number to two decimal places.
 *
 * @param {number} value - the value to round
 * @returns {number} the rounded value
 */
function roundImpl(value) {
    return Math.round(value * 100) / 100;
}

/***
 * Splits a string in the form xxxxxxxx(yyyyy)
 *
 * @param value
 * @returns {object} - object with name and code properties
 */
function splitStringImpl(value) {

    const splitString = nameSplitterRegEx.exec(value);
    if (splitString && splitString.length === 3) {
        return {
            name: splitString[1],
            code: splitString[2]
        };
    }

    return {
        name: value,
        code: unknownMarker
    };
}

module.exports = {
    round: roundImpl,
    splitString: splitStringImpl
}
