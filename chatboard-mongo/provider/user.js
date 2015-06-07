/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    ObjectID = require("mongodb").ObjectID,
    Promise = require("bluebird"),
    provider = require(path.resolve(__dirname, "..", "provider"));

function findOneByFacebookUser(db, user) {
    return Promise.fromNode(function (cb) {
        db.collection("user").findOne({
            "facebookId": user.id
        }, cb);
    });
}

function findOneById(db, _id) {
    return Promise.fromNode(function (cb) {
        db.collection("user").findOne({
            "_id": new ObjectID(_id)
        }, cb);
    });
}

module.exports = {
    "create": provider.create({
        "findOneByFacebookUser": findOneByFacebookUser,
        "findOneById": findOneById
    })
};
