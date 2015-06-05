/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    EVENTS = require(path.resolve(__dirname, "..", "chatboard-events"));

function attachListeners(container) {
    var chatPoolEventEmitter = container.get("chatPoolEventEmitter");

    chatPoolEventEmitter.on(EVENTS.CLIENT_MESSAGE, function (evt) {
        container.facets.chatSocketController.get().then(function (chatSocketController) {
            return chatSocketController.onSocketMessage(evt);
        });
    });
}

function create(container) {
    container.select("chatPoolEventEmitter").on("update", function () {
        attachListeners(container);
    });
    attachListeners(container);
}

module.exports = {
    "create": create
};
