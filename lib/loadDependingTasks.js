"use strict";

var matchdep = require('matchdep');
var path = require('path');
var loadNpmTasks = require('./loadNpmTasks');

module.exports = function loadDependingTasks(grunt, moduleRoot, dev) {
    if (!moduleRoot) {
        moduleRoot = '.';
    }
    matchdep[dev ? "filterDev" : "filter"]('grunt-*', path.resolve(moduleRoot, "package.json")).forEach(function (name) {
        loadNpmTasks(grunt, name, moduleRoot);
    });
};