/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    EVENTS = require(path.resolve(__dirname, "..", "chatboard-enums", "EVENTS"));

function create(chatPoolManager, chatSocketController, indexSocketController, indexSocketServer, indexSocketServerDispatcher) {
    chatPoolManager.subscribe(function (evt) {
        switch (evt.name) {
            case EVENTS.CHTB_CLIENT_CHAT_COLOR_CHANGE:
                return chatSocketController.onSocketColorChange(evt);
            case EVENTS.CHTB_CLIENT_CHAT_ICON_CHANGE:
                return chatSocketController.onSocketIconChange(evt);
            case EVENTS.CHTB_CLIENT_CHAT_ROOM_JOIN_REQUEST:
                return chatSocketController.onSocketRoomJoinRequest(evt);
            case EVENTS.CHTB_CLIENT_CHAT_TITLE_CHANGE:
                return chatSocketController.onSocketTitleChange(evt);
            case EVENTS.CHTB_CLIENT_CONNECTION:
                return chatSocketController.onSocketConnection(evt);
            case EVENTS.CHTB_CLIENT_MESSAGE:
                return chatSocketController.onSocketMessage(evt);
        }

        // evt.socket.disconnect();
    });

    indexSocketServerDispatcher.subscribe(function (evt) {
        switch (evt.name) {
            case EVENTS.CHTB_CLIENT_CHAT_LIST_UPDATE_REQUEST:
                return indexSocketController.onSocketChatListUpdateRequest(evt);
        }
    });
}

module.exports = {
    "create": create
};
