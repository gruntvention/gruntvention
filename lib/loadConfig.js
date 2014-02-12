"use strict";

var fs = require('fs'),
    path = require('path'),
    lodash = require('lodash'),
    cache = {};

function loadSingleConfig(resource, config) {
    if (fs.existsSync(resource)) {
        var cacheObject = cache[resource],
            stats = fs.statSync(resource);
        if (!cacheObject || cacheObject.mtime < stats.mtime) {
            cacheObject = {
                data: require(resource),
                mtime: stats.mtime
            };
            cache[resource] = cacheObject;
        }
        if (typeof cacheObject.data === "function") {
            return cacheObject.data.apply(null, [config || {}]);
        }
        if (config) {
            return lodash.merge(config, cacheObject.data);
        }
        return cacheObject.data;
    }
    return config;
}

module.exports = function loadConfig(dir, config, files) {
    var i = 0,
        l = files.length;
    while (i < l) {
        config = loadSingleConfig(path.resolve(dir, files[i]), config);
        i += 1;
    }
    return config;
};