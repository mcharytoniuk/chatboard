/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

function attachListeners(container) {
    var chatPoolEventEmitter = container.get("chatPoolEventEmitter");

    chatPoolEventEmitter.on("message", function (evt) {
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
