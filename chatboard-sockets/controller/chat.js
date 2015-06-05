/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    EVENTS = require(path.join(__dirname, "..", "..", "chatboard-events")),
    Promise = require("bluebird");

function create(messageStorage) {
    return {
        "onSocketMessage": _.partial(onSocketMessage, messageStorage, _)
    };
}

function onSocketMessage(messageStorage, evt) {
    return messageStorage.insertByChat(evt.data.chat, {
            "author": null,
            "content": evt.data.message.content,
            "date": Date.now(),
            "type": "message"
        })
        .then(function (result) {
            evt.namespacedSocketServer.emit(EVENTS.SERVER_MESSAGE, _.first(result.ops));
        });
}

module.exports = {
    "create": create
};
