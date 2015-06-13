/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    ObjectID = require("mongodb").ObjectID,
    Promise = require("bluebird");

function create(db) {
    return {
        "incrementChatMessageListLength": _.partial(incrementChatMessageListLength, db, _),
        "updateChatColor": _.partial(updateChatColor, db, _, _),
        "updateChatIcon": _.partial(updateChatIcon, db, _, _),
        "updateChatTitle": _.partial(updateChatTitle, db, _, _)
    };
}

function incrementChatMessageListLength(db, chat) {
    return Promise.fromNode(function (cb) {
        db.collection("chat").update({
            "_id": new ObjectID(chat._id)
        }, {
            "$inc": {
                "messageListLength": 1
            }
        }, cb);
    });
}

function updateChatColor(db, chat, newChatColor) {
    return Promise.fromNode(function (cb) {
        db.collection("chat").update({
            "_id": new ObjectID(chat._id)
        }, {
            "$set": {
                "themeClassnames": newChatColor.themeClassnames
            }
        }, cb);
    });
}

function updateChatIcon(db, chat, newChatIcon) {
    return Promise.fromNode(function (cb) {
        db.collection("chat").update({
            "_id": new ObjectID(chat._id)
        }, {
            "$set": {
                "iconClassnames": newChatIcon
            }
        }, cb);
    });
}

function updateChatTitle(db, chat, newChatTitle) {
    return Promise.fromNode(function (cb) {
        db.collection("chat").update({
            "_id": new ObjectID(chat._id)
        }, {
            "$set": {
                "title": newChatTitle
            }
        }, cb);
    });
}

module.exports = {
    "create": create
};
