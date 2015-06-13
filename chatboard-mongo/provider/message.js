/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    ObjectID = require("mongodb").ObjectID,
    Promise = require("bluebird"),
    provider = require(path.resolve(__dirname, "..", "provider"));

function findByChat(db, chat) {
    return Promise.fromNode(function (cb) {
        db.collection("message").find({
            "owner": new ObjectID(chat._id)
        }).toArray(cb);
    });
}

module.exports = {
    "create": provider.create({
        "findByChat": findByChat
    })
};
