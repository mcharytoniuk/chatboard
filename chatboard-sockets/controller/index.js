/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    EVENTS = require(path.resolve(__dirname, "..", "..", "chatboard-enums", "EVENTS")),
    Promise = require("bluebird");

function create(chatProvider, chatSocketServer, indexSocketServer) {
    return {
        "onSocketConnection": _.partial(onSocketConnection, chatProvider, chatSocketServer, indexSocketServer, _),
    };
}

function onSocketConnection(chatProvider, chatSocketServer, indexSocketServer, evt) {
    // _(chatSocketServer.sockets)
    //     .map(function (socket) {
    //         return socket.rooms;
    //     })
    //     .forEach(function (rooms) {
    //         console.log(rooms);
    //     })
    //     .value();

    return chatProvider.findSample(9).then(function (chatList) {
        indexSocketServer.emit(EVENTS.CHTB_SERVER_CHAT_LIST_UPDATE, chatList);
    });
}

module.exports = {
    "create": create
};
