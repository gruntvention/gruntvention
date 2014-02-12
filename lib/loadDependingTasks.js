"use strict";

var matchdep = require('matchdep'),
    path = require('path'),
    loadNpmTasks = require('./loadNpmTasks');

module.exports = function loadDependingTasks(grunt, moduleRoot, dev) {
    if (!moduleRoot) {
        moduleRoot = '.';
    }
    var start = Date.now();
    matchdep[dev ? "filterDev" : "filter"]('grunt-*', path.resolve(moduleRoot, "package.json")).forEach(function (name) {
        loadNpmTasks(grunt, name, moduleRoot);
    });
    grunt.log.debug("It took " + (Date.now() - start) + "ms to load all tasks for root: " + moduleRoot);
};