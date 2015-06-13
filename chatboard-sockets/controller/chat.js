/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    EVENTS = require(path.resolve(__dirname, "..", "..", "chatboard-enums", "EVENTS")),
    Promise = require("bluebird");

function create(chatProvider, chatSocketServer, chatStorage, messageProvider, messageStorage, userProvider) {
    return {
        "onSocketColorChange": _.partial(onSocketColorChange, chatProvider, chatSocketServer, chatStorage, _),
        "onSocketConnection": _.partial(onSocketConnection, chatSocketServer, _),
        "onSocketIconChange": _.partial(onSocketIconChange, chatProvider, chatSocketServer, chatStorage, _),
        "onSocketMessage": _.partial(onSocketMessage, messageStorage, chatSocketServer, _),
        "onSocketRoomJoinRequest": _.partial(onSocketRoomJoinRequest, messageProvider, userProvider, _),
        "onSocketTitleChange": _.partial(onSocketTitleChange, chatProvider, chatSocketServer, chatStorage, _)
    };
}

function onSocketColorChange(chatProvider, chatSocketServer, chatStorage, evt) {
    return chatStorage.updateChatColor(evt.data.chat, evt.data.newChatColor)
        .then(function () {
            return chatProvider.findOneById(evt.data.chat._id);
        })
        .then(function (updatedChat) {
            chatSocketServer.emit(EVENTS.CHTB_SERVER_CHAT_UPDATE, updatedChat);
        });
}

function onSocketConnection(chatSocketServer, evt) {
    evt.socket.broadcast.emit(EVENTS.CHTB_SERVER_MESSAGE, {
        "author": "server",
        "content": "someone has joined the chat",
        "date": Date.now(),
        "_id": Date.now(),
        "type": "info"
    });
}

function onSocketIconChange(chatProvider, chatSocketServer, chatStorage, evt) {
    return chatStorage.updateChatIcon(evt.data.chat, evt.data.newChatIcon)
        .then(function () {
            return chatProvider.findOneById(evt.data.chat._id);
        })
        .then(function (updatedChat) {
            chatSocketServer.to(evt.data.chat._id).emit(EVENTS.CHTB_SERVER_CHAT_UPDATE, updatedChat);
        });
}

function onSocketMessage(messageStorage, chatSocketServer, evt) {
    return messageStorage.insertByChat(evt.data.chat, {
            "content": evt.data.message.content,
            "date": Date.now(),
            "userId": evt.user._id,
            "type": "message"
        })
        .then(function (result) {
            return _.first(result.ops);
        })
        .then(function (insertedMessage) {
            chatSocketServer.to(evt.data.chat._id).emit(EVENTS.CHTB_SERVER_MESSAGE, {
                "message": insertedMessage,
                "user": evt.data.user
            });
        });
}

function onSocketRoomJoinRequest(messageProvider, userProvider, evt) {
    evt.socket.join(evt.data.chat._id);
    messageProvider.findByChat(evt.data.chat)
        .then(function (messageList) {
            return Promise.all([
                messageList,
                userProvider.findByIdList(_.pluck(messageList, "userId"))
            ]);
        })
        .spread(function (messageList, userList) {
            evt.socket.emit(EVENTS.CHTB_SERVER_ROOM_JOIN_APPROVE, {
                "chat": evt.data.chat,
                "messageList": messageList,
                "userList": userList
            });
        });
}

function onSocketTitleChange(chatProvider, chatSocketServer, chatStorage, evt) {
    return chatStorage.updateChatTitle(evt.data.chat, evt.data.newChatTitle)
        .then(function () {
            return chatProvider.findOneById(evt.data.chat._id);
        })
        .then(function (updatedChat) {
            chatSocketServer.of(evt.data.chat._id).emit(EVENTS.CHTB_SERVER_CHAT_UPDATE, updatedChat);
        });
}

module.exports = {
    "create": create
};
