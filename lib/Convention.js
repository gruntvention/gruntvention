"use strict";

var loadDependingTasks = require('./loadDependingTasks'),
    makeUsefulConfig = require('./makeUsefulConfig'),
    addUsefulTasks = require('./addUsefulTasks'),
    merge = require('lodash').merge,
    replaceVariableInKeys = require('./replaceVariableInKeys'),
    path = require('path'),
    applyRegisterModification = require('./applyRegisterModification'),
    registerAfter = require("./registerAfter"),
    registerBefore = require("./registerBefore"),
    util = require("util"),
    glob = require('glob');

function Convention(dir) {
    var i, self = this;
    if (this instanceof Convention) {
        this.dir = dir;
        this.registerModifications = [];
        this._registerTaskWrapper = function (name, arg1, arg2) {
            var subtasks, modification, args = arguments;
            if (args.length === 3) {
                subtasks = arg2;
            } else if (arguments.length === 2) {
                subtasks = arg1;
            }
            for (i = self.registerModifications.length - 1; i >= 0; i -= 1) {
                modification = self.registerModifications[i];
                if (modification.name === name) {
                    modification.task(subtasks);
                }
            }
            if (args.length === 3) {
                args[2] = subtasks;
            } else if (args.length === 2) {
                args[1] = subtasks;
            }
            this.__gv_registerTask.apply(this, args);
        };
    } else {
        return new Convention(dir);
    }
}

Convention.prototype._wrapGrunt = function (grunt) {
    if (grunt.registerTask !== this._registerTaskWrapper) {
        grunt.__gv_registerTask = grunt.registerTask;
        grunt.registerTask = this._registerTaskWrapper;
        grunt.task.__gv_registerTask = grunt.task.registerTask;
        grunt.task.registerTask = this._registerTaskWrapper;
    }
};

Convention.prototype.install = function () {
    // TODO: automate the installation of grunt in the system and prepare a ./grunt file if grunt isn't found
    //       in the command line
    return;
};

Convention.prototype.init = function (grunt, config, variants) {
    this._wrapGrunt(grunt);
    return Convention.init(grunt, this.dir, config, variants);
};

Convention.prototype.modifyRegister = function (options) {
    var tasks, taskName, i;
    for (taskName in options) {
        if (options.hasOwnProperty(taskName)) {
            tasks = options[taskName];
            for (i = tasks.length - 1; i >= 0; i -= 1) {
                this.registerModifications.push({
                    name: taskName,
                    task: tasks[i]
                });
            }
        }
    }
    return this;
};

Convention.prototype.registerAfter = function (options) {
    this.modifyRegister(applyRegisterModification(options, registerAfter));
    return this;
};

Convention.prototype.registerBefore = function (options) {
    this.modifyRegister(applyRegisterModification(options, registerBefore));
    return this;
};

Convention.prototype.setup = function (grunt) {
    this._wrapGrunt(grunt);
    return Convention.setup(grunt, this.dir);
};

Convention.setup = function (grunt, conventionRoot) {
    var loadingStart = Date.now(),
        addingStart,
        usefulStart,
        config;

    loadDependingTasks(grunt, '.', true);
    loadDependingTasks(grunt, conventionRoot, false);
    grunt.log.debug("It took " + (Date.now() - loadingStart) + "ms to load all depending tasks.");

    addingStart = Date.now();
    addUsefulTasks(grunt);
    grunt.log.debug("It took " + (Date.now() - addingStart) + "ms to add useful tasks.");

    usefulStart = Date.now();
    config = makeUsefulConfig(grunt);
    grunt.log.debug("It took " + (Date.now() - usefulStart) + "ms to add useful configuration.");
    return config;
};

Convention.initVariant = function (rules, grunt, variant, variantConfig) {
    var config = rules(grunt, variant, variantConfig);
    replaceVariableInKeys(config, "variant", variant);
    return config;
};

Convention.init = function (grunt, conventionRoot, additionalConfig, variants) {
    var variant,
        additionalConfigStart,
        variantStart,
        start = Date.now(),
        rules = require(path.resolve(conventionRoot, "rules", "index")),
        variantRules = require(path.resolve(conventionRoot, "rules", "index.variant")),
        config = merge({}, Convention.setup(grunt, conventionRoot)),
        i;
    if (variants !== null) {
        for (i = 0; i < variants.length; i += 1) {
            variant = variants[i];
            variantStart = Date.now();
            config = merge(config, Convention.initVariant(variantRules, grunt, variant));
            grunt.log.debug("It took " + (Date.now() - variantStart) + "ms to merge the configuration for variant: " + variant + ".");
        }
    } else {
        config = merge(config, Convention.initVariant(variantRules, grunt, "default"));
    }
    additionalConfigStart = Date.now();
    config = merge(config, rules(grunt), additionalConfig);
    grunt.log.debug("It took " + (Date.now() - additionalConfigStart) + "ms to merge the additional configuration.");
    grunt.log.debug("It took " + (Date.now() - start) + "ms to merge all configuration.");
    grunt.initConfig(config);
};

module.exports = Convention;