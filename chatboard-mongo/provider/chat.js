/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    iconClassnames = require(path.resolve(__dirname, "..", "..", "chatboard-enums", "CHAT_ICONS")),
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

function findSample(db, limit) {
    return Promise.fromNode(function (cb) {
        db.collection("chat").find({
            "isPublic": true
        }).limit(limit).toArray(cb);
    });
}

module.exports = {
    "create": provider.create({
        "find": find,
        "findOneById": findOneById,
        "findSample": findSample
    })
};
