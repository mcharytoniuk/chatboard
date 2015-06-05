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
        "insertByChat": _.partial(insertByChat, db, _, _)
    };
}

function insertByChat(db, chat, message) {
    return Promise.fromNode(function (cb) {
        db.collection("message").insert(_.merge(message, {
            "owner": new ObjectID(chat._id)
        }), cb);
    });
}

module.exports = {
    "create": create
};
