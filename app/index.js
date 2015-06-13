/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    container = require(path.resolve(__dirname, "container")),
    containerInstance,
    parameters = require(path.resolve(__dirname, "parameters")),
    parametersFilePath = path.resolve(__dirname, "..", "parameters.json");

containerInstance = container.create({
    "chatPool": {},
    "sessionCookieName": "chatboard.sid"
});

parameters.create(parametersFilePath).onUpdate(function (err, data) {
    containerInstance.set("parameters", data);
    containerInstance.commit();

    containerInstance.facets.eventDispatcher.get();
    containerInstance.facets.socketServer.get();
});
