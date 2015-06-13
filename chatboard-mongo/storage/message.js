/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    ObjectID = require("mongodb").ObjectID,
    Promise = require("bluebird");

function create(chatStorage, db) {
    return {
        "insertByChat": _.partial(insertByChat, chatStorage, db, _, _)
    };
}

function insertByChat(chatStorage, db, chat, message) {
    return Promise.all([
        chatStorage.incrementChatMessageListLength(chat),
        Promise.fromNode(function (cb) {
            db.collection("message").insert(_.merge(message, {
                "owner": new ObjectID(chat._id),
                "userId": new ObjectID(message.userId)
            }), cb);
        })
    ]);
}

module.exports = {
    "create": create
};
