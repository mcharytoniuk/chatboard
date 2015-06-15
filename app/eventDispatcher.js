/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    EVENTS = require(path.resolve(__dirname, "..", "chatboard-enums", "EVENTS"));

function create(chatPoolManager, chatSocketController, indexSocketController, indexSocketServer) {
    var callbacks = {};

    callbacks[EVENTS.CHTB_CLIENT_CHAT_COLOR_CHANGE] = chatSocketController.onSocketColorChange;
    callbacks[EVENTS.CHTB_CLIENT_CHAT_ICON_CHANGE] = chatSocketController.onSocketIconChange;
    callbacks[EVENTS.CHTB_CLIENT_CHAT_ROOM_JOIN_REQUEST] = chatSocketController.onSocketRoomJoinRequest;
    callbacks[EVENTS.CHTB_CLIENT_CHAT_TITLE_CHANGE] = chatSocketController.onSocketTitleChange;
    callbacks[EVENTS.CHTB_CLIENT_CONNECTION] = chatSocketController.onSocketConnection;
    callbacks[EVENTS.CHTB_CLIENT_MESSAGE] = chatSocketController.onSocketMessage;

    chatPoolManager.subscribe(function (evt) {
        callbacks[evt.name](evt);
    });

    indexSocketServer.on("connection", function (socket) {
        indexSocketController.onSocketConnection({
            "socket": socket
        });
    });
}

module.exports = {
    "create": create
};
