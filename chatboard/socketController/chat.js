/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    EVENTS = require(path.join(__dirname, "..", "..", "chatboard-events")),
    Promise = require("bluebird");

function create() {
    return {
        "onSocketMessage": onSocketMessage
    };
}

function onSocketMessage(evt) {
    evt.namespacedSocketServer.emit(EVENTS.SERVER_MESSAGE, {
        "_id": Date.now(),
        "author": "AUTHOR",
        "content": evt.message,
        "date": Date.now(),
        "type": "message"
    });
}

module.exports = {
    "create": create
};
