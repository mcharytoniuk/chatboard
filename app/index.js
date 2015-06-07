/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    app,
    container = require(path.resolve(__dirname, "container")),
    containerInstance,
    fs = require("fs"),
    parametersFilePath = path.resolve(__dirname, "..", "parameters.json");

containerInstance = container.create({
    "chatPool": {},
    "sessionCookieName": "chatboard.sid"
});

function onParametersChange() {
    fs.readFile(parametersFilePath, function (err, data) {
        data = JSON.parse(data.toString());

        containerInstance.set("parameters", data);
        containerInstance.commit();

        containerInstance.facets.eventDispatcher.get();
        containerInstance.facets.socketServer.get();
    });
}

fs.watch(parametersFilePath, onParametersChange);
onParametersChange();
