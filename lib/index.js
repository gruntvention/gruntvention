"use strict";

module.exports = {
    addFilebasedSubtasks:     require("./addFilebasedSubtasks"),
    addUsefulTasks:           require("./addUsefulTasks"),
    applyInjection:           require("./applyRegisterModification"),
    collectConfig:            require("./collectConfig"),
    collectConfigFromFolders: require("./collectConfigFromFolders"),
    Convention:               require("./Convention"),
    loadConfig:               require("./loadConfig"),
    loadDependingTasks:       require("./loadDependingTasks"),
    loadNpmTasks:             require("./loadNpmTasks"),
    makeUsefulConfig:         require("./makeUsefulConfig"),
    registerAfter:            require("./registerAfter"),
    registerBefore:           require("./registerBefore"),
    replaceKey:               require("./replaceKey"),
    replaceVariableInKeys:    require("./replaceVariableInKeys")
};