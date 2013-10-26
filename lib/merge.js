"use strict";

module.exports = function(a, b) {
    var aValue, bValue, key, result;
    result = {};
    for (key in b) {
        bValue = b[key];
        aValue = a[key];
        if (typeof aValue === "object" && typeof bValue === "object") {
            result[key] = merge(a[key], bValue);
        } else {
            result[key] = bValue;
        }
    }
    for (key in a) {
        aValue = a[key];
        if (!result[key]) {
            result[key] = aValue;
        }
    }
    return result;
};