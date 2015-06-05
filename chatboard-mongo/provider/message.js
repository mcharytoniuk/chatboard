/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    lipsum = require("ainojs-lipsum"),
    Promise = require("bluebird"),
    provider = require(path.resolve(__dirname, "..", "provider")),
    types;

types = [
    "communicate",
    "info",
    "message",
    "success",
    "warning"
];

function mockMessage() {
    return {
        "author": lipsum.words(_.random(2, 3)),
        "content": lipsum.words(_.random(10, 25)),
        "date": new Date(),
        "type": _.sample(types)
    };
}

function findByChat(db, chat) {
    return Promise.fromNode(function (cb) {
        db.collection("message").find({
            "owner": chat._id
        }).toArray(cb);
    });
}

module.exports = {
    "create": provider.create({
        "findByChat": findByChat
    })
};
