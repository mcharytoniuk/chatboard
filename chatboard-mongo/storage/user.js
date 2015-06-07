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
        "insertUsingFacebookUser": _.partial(insertUsingFacebookUser, db, _)
    };
}

function insertUsingFacebookUser(db, user) {
    return Promise.fromNode(function (cb) {
        db.collection("user").insert({
            "displayName": user.displayName,
            "facebookId": user.id,
            "gender": user.gender,
            "name": user.name,
            "username": user.username
        }, cb);
    });
}

module.exports = {
    "create": create
};
