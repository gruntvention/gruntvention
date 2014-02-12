"use strict";
var path = require("path");

module.exports = function loadNpmTasks(grunt, name, dir) {
    var start = Date.now(),
        init = Date.now(),
        modulesRoot = path.resolve(dir || '.', 'node_modules'),
        moduleRoot = path.join(modulesRoot, name),
        pkgfile = path.join(modulesRoot, name, 'package.json'),
        pkg = grunt.file.exists(pkgfile) ? grunt.file.readJSON(pkgfile) : {keywords: []},
        tasksdir = path.join(moduleRoot, 'tasks');

    grunt.log.debug("Init loading of " + name + " took " + (Date.now() - start) + "ms");

    start = Date.now();

    // Process collection plugins.
    if (pkg.keywords && pkg.keywords.indexOf('gruntcollection') !== -1) {
        Object.keys(pkg.dependencies).forEach(function (depName) {
            // Npm sometimes pulls dependencies out if they're shared, so find
            // upwards if not found locally.
            var filepath = grunt.file.findup('node_modules/' + depName, {
                cwd: moduleRoot,
                nocase: true
            });
            if (filepath) {
                // Load this task plugin recursively.
                loadNpmTasks(path.relative(modulesRoot, filepath));
            }
        });
    }

    grunt.log.debug("Dependencies of " + name + " took " + (Date.now() - start) + "ms to load");

    start = Date.now();

    // Process task plugins.
    if (grunt.file.exists(tasksdir)) {
        grunt.task.loadTasks(tasksdir);
    } else {
        grunt.log.error('Local Npm module "' + name + '" not found. Is it installed?');
    }

    grunt.log.debug("Loading of " + name + " took totally " + (Date.now() - init) + "ms (" + (Date.now() - start) + "ms for the last step)");
};