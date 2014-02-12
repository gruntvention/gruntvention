"use strict";

var replaceKey = require('./replaceKey');

module.exports = function replaceVariableInKeys(object, variable, value) {
    var targetValue, key, newKey;
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            newKey = replaceKey(key, variable, value);
            targetValue = object[key];
            if (newKey !== key) {
                delete object[key];
                object[newKey] = targetValue;
            }
            if (typeof targetValue === "object") {
                // TODO: fix possibly endless recursion..
                replaceVariableInKeys(targetValue, variable, value);
            }
        }
    }
    return object;
};