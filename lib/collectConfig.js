"use strict";

var path = require('path'),
    collectConfigFromFolders = require("./collectConfigFromFolders");

module.exports = function (target, config, additionalFolders, files) {
    if (!additionalFolders) {
        additionalFolders = [];
    }

    additionalFolders.unshift(path.dirname(target));
    return collectConfigFromFolders(config, additionalFolders, files);
};