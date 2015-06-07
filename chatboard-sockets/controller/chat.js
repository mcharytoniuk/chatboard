/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    EVENTS = require(path.resolve(__dirname, "..", "..", "chatboard-enums", "EVENTS")),
    Promise = require("bluebird");

function create(chatProvider, chatStorage, messageStorage) {
    return {
        "onSocketColorChange": _.partial(onSocketColorChange, chatProvider, chatStorage, _),
        "onSocketConnection": _.partial(onSocketConnection, _),
        "onSocketIconChange": _.partial(onSocketIconChange, chatProvider, chatStorage, _),
        "onSocketMessage": _.partial(onSocketMessage, messageStorage, _),
        "onSocketTitleChange": _.partial(onSocketTitleChange, chatProvider, chatStorage, _)
    };
}

function onSocketColorChange(chatProvider, chatStorage, evt) {
    return chatStorage.updateChatColor(evt.data.chat, evt.data.newChatColor)
        .then(function () {
            return chatProvider.findOneById(evt.data.chat._id);
        })
        .then(function (updatedChat) {
            evt.namespacedSocketServer.emit(EVENTS.CHTB_SERVER_CHAT_UPDATE, updatedChat);
        });
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

function onSocketIconChange(chatProvider, chatStorage, evt) {
    return chatStorage.updateChatIcon(evt.data.chat, evt.data.newChatIcon)
        .then(function () {
            return chatProvider.findOneById(evt.data.chat._id);
        })
        .then(function (updatedChat) {
            evt.namespacedSocketServer.emit(EVENTS.CHTB_SERVER_CHAT_UPDATE, updatedChat);
        });
}

function onSocketMessage(messageStorage, evt) {
    return messageStorage.insertByChat(evt.data.chat, {
            "author": evt.user,
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

function onSocketTitleChange(chatProvider, chatStorage, evt) {
    return chatStorage.updateChatTitle(evt.data.chat, evt.data.newChatTitle)
        .then(function () {
            return chatProvider.findOneById(evt.data.chat._id);
        })
        .then(function (updatedChat) {
            evt.namespacedSocketServer.emit(EVENTS.CHTB_SERVER_CHAT_UPDATE, updatedChat);
        });
}

module.exports = {
    "create": create
};
