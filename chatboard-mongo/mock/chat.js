/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    CHAT_ICONS = require(path.resolve(__dirname, "..", "..", "chatboard-enums", "CHAT_ICONS")),
    CHAT_THEMES = require(path.resolve(__dirname, "..", "..", "chatboard-enums", "CHAT_THEMES")),
    lipsum = require("ainojs-lipsum");

function mockChat() {
    return {
        "iconClassnames": _.sample(CHAT_ICONS),
        "memberListLength": 0,
        "messageListLength": 0,
        "themeClassnames": _.sample(CHAT_THEMES).themeClassnames,
        "title": lipsum.words(_.random(1, 5)),
        "urlCanonical": null,
        "urlOther": []
    };
}

module.exports = {
    "mockChat": mockChat
};
