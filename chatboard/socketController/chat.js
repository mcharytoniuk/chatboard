/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var _ = require("lodash"),
    Promise = require("bluebird");

function create() {
    return {
        "onSocketMessage": onSocketMessage
    };
}

function onSocketMessage(evt) {
    evt.namespacedSocketServer.emit("message", {
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
