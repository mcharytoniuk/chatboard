/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    env = require(path.resolve(__dirname, "env")),
    fs = require("fs"),
    Promise = require("bluebird");

function create(parametersFilePath) {
    return {
        "onUpdate": function (cb) {
            onUpdate(parametersFilePath, cb);
        }
    };
}

function onParametersChange(parametersFilePath) {
    return readJSON(parametersFilePath).then(function (data) {
        var overridePath;

        if (!data.override) {
            return data;
        }

        overridePath = path.dirname(parametersFilePath);

        if (env.isDevelopment()) {
            overridePath = path.resolve(overridePath, data.override.development);
        } else {
            overridePath = path.resolve(overridePath, data.override.production);
        }

        return readJSON(overridePath);
    });
}

function onUpdate(parametersFilePath, cb) {
    function doOnUpdate() {
        onParametersChange(parametersFilePath).nodeify(cb);
    }

    fs.watch(parametersFilePath, doOnUpdate);
    doOnUpdate();
}

function readJSON(filePath) {
    return Promise.fromNode(function (cb) {
        fs.readFile(filePath, cb);
    }).then(function (data) {
        return JSON.parse(data.toString());
    });
}

module.exports = {
    "create": create
};
