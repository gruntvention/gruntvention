"use strict";

module.exports = function replaceKey(key, variable, value) {
    return key.split("${" + variable + "}").join(value);
};