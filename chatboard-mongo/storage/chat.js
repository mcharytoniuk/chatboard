/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    mock = require(path.resolve(__dirname, "..", "mock", "chat")),
    ObjectID = require("mongodb").ObjectID,
    Promise = require("bluebird"),
    url = require("url");

function create(chatProvider, db, parameters) {
    return {
        "incrementChatMessageListLength": _.partial(incrementChatMessageListLength, db, _),
        "insert": _.partial(insert, chatProvider, db, parameters, _),
        "updateChatColor": _.partial(updateChatColor, db, _, _),
        "updateChatIcon": _.partial(updateChatIcon, db, _, _),
        "updateChatPrivacy": _.partial(updateChatPrivacy, db, _, _),
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

function insert(chatProvider, db, parameters) {
    return Promise.fromNode(function (cb) {
        db.collection("chat").insert(mock.mockChat(), cb);
    }).then(function (result) {
        return updateChatCanonicalUrl(chatProvider, db, parameters, _.first(result.ops));
    });
}

function updateChatCanonicalUrl(chatProvider, db, parameters, chat) {
    var urlCanonical = _.merge(_.cloneDeep(parameters.chatboard.url), {
        "pathname": String(chat._id)
    });

    urlCanonical = url.format(urlCanonical);

    return Promise.fromNode(function (cb) {
        db.collection("chat").update({
            "_id": new ObjectID(chat._id)
        }, {
            "$set": {
                "urlCanonical": urlCanonical
            }
        }, cb);
    }).then(function () {
        return chatProvider.findOneById(chat._id);
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

function updateChatPrivacy(db, chat, newChatPrivacy) {
    return Promise.fromNode(function (cb) {
        db.collection("chat").update({
            "_id": new ObjectID(chat._id)
        }, {
            "$set": {
                "isPrivate": newChatPrivacy
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
