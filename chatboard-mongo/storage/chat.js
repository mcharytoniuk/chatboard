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
        "updateChatTitle": _.partial(updateChatTitle, db, _, _)
    };
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
