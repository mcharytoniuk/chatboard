/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    EVENTS = require(path.resolve(__dirname, "..", "..", "chatboard-enums", "EVENTS")),
    Promise = require("bluebird");

function create(chatStorage, messageStorage) {
    return {
        "onSocketConnection": _.partial(onSocketConnection, _),
        "onSocketIconChange": _.partial(onSocketIconChange, chatStorage, _),
        "onSocketMessage": _.partial(onSocketMessage, messageStorage, _),
        "onSocketTitleChange": _.partial(onSocketTitleChange, chatStorage, _)
    };
}

function onSocketConnection(evt) {
    evt.socket.broadcast.emit(EVENTS.CHTB_SERVER_MESSAGE, {
        "author": "server",
        "content": "someone has joined the chat",
        "date": Date.now(),
        "_id": Date.now(),
        "type": "info"
    });
}

function onSocketIconChange(chatStorage, evt) {
    return chatStorage.updateChatIcon(evt.data.chat, evt.data.newChatIcon)
        .then(function () {
            return _.merge(evt.data.chat, {
                "iconClassnames": evt.data.newChatIcon
            });
        })
        .then(function (updatedChat) {
            evt.namespacedSocketServer.emit(EVENTS.CHTB_SERVER_CHAT_UPDATE, updatedChat);
        });
}

function onSocketMessage(messageStorage, evt) {
    return messageStorage.insertByChat(evt.data.chat, {
            "author": null,
            "content": evt.data.message.content,
            "date": Date.now(),
            "type": "message"
        })
        .then(function (result) {
            return _.first(result.ops);
        })
        .then(function (insertedMessage) {
            evt.namespacedSocketServer.emit(EVENTS.CHTB_SERVER_MESSAGE, insertedMessage);
        });
}

function onSocketTitleChange(chatStorage, evt) {
    return chatStorage.updateChatTitle(evt.data.chat, evt.data.newChatTitle)
        .then(function () {
            return _.merge(evt.data.chat, {
                "title": evt.data.newChatTitle
            });
        })
        .then(function (updatedChat) {
            evt.namespacedSocketServer.emit(EVENTS.CHTB_SERVER_CHAT_UPDATE, updatedChat);
        });
}

module.exports = {
    "create": create
};
