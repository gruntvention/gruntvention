"use strict";

var path = require('path');
var fs = require('fs');

function fill(target, source) {
    var key, targetValue, value;
    for (key in source) {
        value = source[key];
        targetValue = target[key];
        if (typeof value === "object") {
            target[key] = fill((typeof targetValue === "object" ? targetValue : {}), value);
        } else {
            target[key] = value;
        }
    }
    return target;
}

function loadSingleConfig(path, config) {
    if (fs.existsSync(path)) {
        var newConfig = require(path);
        if (typeof newConfig === "function") {
            return newConfig(config);
        }
        return fill(config, newConfig);
    }
    return config;
}

function loadConfig(dir, config, files) {
    var i = 0,
        l = files.length;
    while (i < l) {
        config = loadSingleConfig(path.join(dir, files[i]), config);
        i += 1;
    }
    return config;
}

module.exports = function (config, folders, files) {
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