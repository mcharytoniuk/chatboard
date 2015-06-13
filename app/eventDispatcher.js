/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    EVENTS = require(path.resolve(__dirname, "..", "chatboard-enums", "EVENTS"));

function create(chatPoolManager, chatSocketController, indexSocketController) {
    var callbacks = {};

    callbacks[EVENTS.CHTB_CLIENT_CHAT_COLOR_CHANGE] = chatSocketController.onSocketColorChange;
    callbacks[EVENTS.CHTB_CLIENT_CHAT_ICON_CHANGE] = chatSocketController.onSocketIconChange;
    callbacks[EVENTS.CHTB_CLIENT_CHAT_ROOM_JOIN_REQUEST] = chatSocketController.onSocketRoomJoinRequest;
    callbacks[EVENTS.CHTB_CLIENT_CHAT_TITLE_CHANGE] = chatSocketController.onSocketTitleChange;
    callbacks[EVENTS.CHTB_CLIENT_CONNECTION] = function (evt) {
        process.nextTick(function () {
            indexSocketController.onSocketConnection(evt);
        });
        process.nextTick(function () {
            chatSocketController.onSocketConnection(evt);
        });
    };
    callbacks[EVENTS.CHTB_CLIENT_MESSAGE] = chatSocketController.onSocketMessage;

    chatPoolManager.subscribe(function (evt) {
        callbacks[evt.name](evt);
    });
}

module.exports = {
    "create": create
};
