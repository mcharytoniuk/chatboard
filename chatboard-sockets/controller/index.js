/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    EVENTS = require(path.resolve(__dirname, "..", "..", "chatboard-enums", "EVENTS")),
    Promise = require("bluebird");

function create(chatProvider) {
    return {
        "onSocketChatListUpdateRequest": _.partial(onSocketChatListUpdateRequest, chatProvider, _),
    };
}

function onSocketChatListUpdateRequest(chatProvider, evt) {
    return chatProvider.findSample(45).then(function (chatList) {
        evt.socket.emit(EVENTS.CHTB_SERVER_CHAT_LIST_UPDATE, chatList);
    });
}

module.exports = {
    "create": create
};
