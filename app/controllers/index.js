/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var _ = require("lodash"),
    lipsum = require("ainojs-lipsum"),
    iconClassnames,
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

module.exports = function (req, res) {
    res.render("layout/index.html.twig", {
        "chatList": _.range(25).map(function () {
            return {
                "iconClassnames": _.sample(iconClassnames),
                "membersCount": _.random(1, 120),
                "messagesCount": _.random(0, 120),
                "themeClassnames": _.sample(themeClassnames),
                "title": lipsum.words(_.random(1, 5))
            };
        })
    });
};
