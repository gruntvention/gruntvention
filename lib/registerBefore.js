"use strict";

var util = require("util");

module.exports = function (before, task) {
    return function (target) {
        var args, index;
        if (util.isArray(target)) {
            index = target.indexOf(before);
            if (index !== -1) {
                args = [index, 0];
                if (!util.isArray(task)) {
                    args.push(task);
                } else {
                    args = args.concat(task);
                }
                target.splice.apply(target, args);
            } else {
                console.warn("Warning: could not find ", before, "in", target, "to prepend", task);
            }
        }
        return target;
    };
};