/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    EVENTS = require(path.resolve(__dirname, "..", "chatboard-enums", "EVENTS"));

function create(chatPoolManager, chatSocketController) {
    chatPoolManager.subscribe(function (evt) {
        switch (evt.name) {
            case EVENTS.CHTB_CLIENT_CHAT_COLOR_CHANGE:
                chatSocketController.onSocketColorChange(evt);
                return;
            case EVENTS.CHTB_CLIENT_CHAT_ICON_CHANGE:
                chatSocketController.onSocketIconChange(evt);
                return;
            case EVENTS.CHTB_CLIENT_CHAT_ROOM_JOIN_REQUEST:
                chatSocketController.onSocketRoomJoinRequest(evt);
                return;
            case EVENTS.CHTB_CLIENT_CHAT_TITLE_CHANGE:
                chatSocketController.onSocketTitleChange(evt);
                return;
            case EVENTS.CHTB_CLIENT_CONNECTION:
                chatSocketController.onSocketConnection(evt);
                return;
            case EVENTS.CHTB_CLIENT_MESSAGE:
                chatSocketController.onSocketMessage(evt);
                return;
        }
    });
}

module.exports = {
    "create": create
};
