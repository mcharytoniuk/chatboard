/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    EVENTS = require(path.resolve(__dirname, "..", "chatboard-enums", "EVENTS"));

function attachListeners(container) {
    var chatPoolEventEmitter = container.get("chatPoolEventEmitter");

    chatPoolEventEmitter.on(EVENTS.CHTB_CLIENT_CHAT_COLOR_CHANGE, function (evt) {
        container.facets.chatSocketController.get().then(function (chatSocketController) {
            return chatSocketController.onSocketColorChange(evt);
        });
    });

    chatPoolEventEmitter.on(EVENTS.CHTB_CLIENT_CHAT_ICON_CHANGE, function (evt) {
        container.facets.chatSocketController.get().then(function (chatSocketController) {
            return chatSocketController.onSocketIconChange(evt);
        });
    });

    chatPoolEventEmitter.on(EVENTS.CHTB_CLIENT_CHAT_TITLE_CHANGE, function (evt) {
        container.facets.chatSocketController.get().then(function (chatSocketController) {
            return chatSocketController.onSocketTitleChange(evt);
        });
    });

    chatPoolEventEmitter.on(EVENTS.CHTB_CLIENT_CONNECTION, function (evt) {
        container.facets.chatSocketController.get().then(function (chatSocketController) {
            return chatSocketController.onSocketConnection(evt);
        });
    });

    chatPoolEventEmitter.on(EVENTS.CHTB_CLIENT_MESSAGE, function (evt) {
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
