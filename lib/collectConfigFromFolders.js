"use strict";

var path = require('path'),
    loadConfig = require('./loadConfig');

module.exports = function collectConfigFromFolders(config, folders, files) {
    var i = 0,
        l = folders.length,
        folder;
    if (!files) {
        files = ["index.json", "index.js", "index.coffee", "_.json", "_.js", "_.coffee"];
    }
    if (!config) {
        config = {};
    }
    while (i < l) {
        folder = folders[i];
        config = loadConfig(path.resolve(folder), config, files);
        i += 1;
    }
    return config;
};