/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    iconClassnames,
    lipsum = require("ainojs-lipsum"),
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
    return provider.toArray(db.collection("chat").find({}));
}

function findOneBySlug(db, slug) {
    return new Promise(function (resolve, reject) {
        db.collection("chat").findOne({
            "slug": slug
        }, function (err, chat) {
            if (err) {
                reject(err);
            } else {
                resolve(chat);
            }
        });
    });
}

function mockChat() {
    var title = lipsum.words(_.random(1, 5));

    return {
        "iconClassnames": _.sample(iconClassnames),
        "membersCount": _.random(1, 120),
        "messagesCount": _.random(0, 120),
        "themeClassnames": _.sample(themeClassnames),
        "slug": _.kebabCase(title),
        "title": title
    };
}

module.exports = {
    "create": provider.create({
        "find": find,
        "findOneBySlug": findOneBySlug
    })
};
