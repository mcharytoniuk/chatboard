/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    iconClassnames,
    lipsum = require("ainojs-lipsum"),
    ObjectID = require("mongodb").ObjectID,
    Promise = require("bluebird"),
    provider = require(path.resolve(__dirname, "..", "provider")),
    themeClassnames;

iconClassnames = [
    "fa fa-meh-o",
    "fa fa-comments-o",
    "fa fa-bicycle",
    "fa fa-facebook-official",
    "ion-android-happy",
    "ion-android-sad",
    "ion-beer",
    "ion-pizza",
    "ion-ios-sunny",
    "ion-headphone",
    "ion-heart",
    "ion-map"
];

themeClassnames = [
    "theme-calmBlack",
    "theme-calmGray",
    "theme-deepBlue",
    "theme-deepPurple",
    "theme-eveningSand",
    "theme-greenSea",
    "theme-greenSun",
    "theme-pinkStraw",
    "theme-redAccent",
    "theme-redShine",
    "theme-skyBlue",
    "theme-underWater"
];

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
