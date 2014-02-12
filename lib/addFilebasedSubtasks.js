"use strict";

var glob = require('glob'),
    replaceKey = require('./replaceKey'),
    replaceVariableInKeys = require('./replaceVariableInKeys'),
    merge = require('lodash').merge;

module.exports = function addFilebasedSubtasks(config, pattern, namePattern, configFactory) {
    var i, file, name, partConfig, partValue,
        globRule = pattern.replace(/\$\{part\}/g, "**/*"),
        nameRegExp = new RegExp("^" +
                pattern
                .replace(/[\\\/.?]/g, function (match) {return "\\" + match; })
                .replace(/\$\{part\}/g, "(.*)")
            + "$"),
        files = glob.sync(globRule);

    for (i = 0; i < files.length; i += 1) {
        file = nameRegExp.exec(files[i])[1];
        partValue = file.split("/").join("_");
        name = replaceKey(namePattern, "part", partValue);
        partConfig = replaceVariableInKeys(configFactory(name, partValue, files[i], file), "part", partValue);
        config = merge(config, partConfig);
    }
    return config;
};