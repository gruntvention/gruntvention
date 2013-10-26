"use strict";

var loadDependingTasks = require('./loadDependingTasks'),
    makeUsefulConfig = require('./makeUsefulConfig'),
    addUsefulTasks = require('./addUsefulTasks'),
    merge = require('./merge'),
    path = require('path'),
    glob = require('glob');

function Convention(dir) {
    if (this instanceof Convention) {
        this.dir = dir;
        return this;
    }
    return new Convention(dir);
}

Convention.prototype.install = function () {
    // TODO: automate the installation of grunt in the system and prepare a ./grunt file if grunt isn't found
    //       in the command line
    return;
};

Convention.prototype.init = function (grunt, config) {
    return Convention.init(grunt, this.dir, config);
};

Convention.prototype.setup = function (grunt) {
    return Convention.setup(grunt, this.dir);
};

Convention.setup = function (grunt, conventionRoot) {
    loadDependingTasks(grunt, '.', true);
    loadDependingTasks(grunt, conventionRoot, false);
    addUsefulTasks(grunt);

    var config = makeUsefulConfig(grunt),
        conventionConfig = require(path.resolve(conventionRoot, "rules"))(grunt);

    return merge(config, conventionConfig);
};

Convention.init = function (grunt, conventionRoot, config) {
    grunt.initConfig(merge(Convention.setup(grunt, conventionRoot), config));
};

module.exports = Convention;