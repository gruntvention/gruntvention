"use strict";

module.exports = function (options, modification) {
    var applied = {}, uses, newUses, i, name;
    for (name in options) {
        if (options.hasOwnProperty(name)) {
            uses = options[name];
            newUses = [];
            for (i = uses.length - 1; i >= 0; i -= 1) {
                newUses.push(modification.apply(null, Array.prototype.concat(uses[i], null)));
            }
            applied[name] = newUses;
        }
    }
    return applied;
};