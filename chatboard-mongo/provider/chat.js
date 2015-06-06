/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    iconClassnames = require(path.resolve(__dirname, "..", "..", "chatboard-enums", "CHAT_ICONS")),
    lipsum = require("ainojs-lipsum"),
    ObjectID = require("mongodb").ObjectID,
    Promise = require("bluebird"),
    provider = require(path.resolve(__dirname, "..", "provider")),
    themeClassnames = require(path.resolve(__dirname, "..", "..", "chatboard-enums", "CHAT_THEMES"));

function find(db, count) {
    return Promise.fromNode(function (cb) {
        db.collection("chat").find({}).toArray(cb);
    });
}

function findOneById(db, _id) {
    return Promise.fromNode(function (cb) {
        db.collection("chat").findOne({
            "_id": new ObjectID(_id)
        }, cb);
    });
}

function mockChat() {
    var title = lipsum.words(_.random(1, 5));

    return {
        "iconClassnames": _.sample(iconClassnames),
        "membersCount": _.random(1, 120),
        "messagesCount": _.random(0, 120),
        "themeClassnames": _.sample(themeClassnames),
        "title": title
    };
}

module.exports = {
    "create": provider.create({
        "find": find,
        "findOneById": findOneById
    })
};
