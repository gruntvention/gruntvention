"use strict";


module.exports = function (grunt) {
    return {
        "TIMESTAMP": grunt.template.today('yyyy-mm-dd_HH-MM-ss'),
        "REVISION": "<%=TIMESTAMP%>",
        "LOCAL_IP": require("my-ip"),
        "DEFAULT_PORT": 3000,
        "PORT": "<%=DEFAULT_PORT%>"
    };
};