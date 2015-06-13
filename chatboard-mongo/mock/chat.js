/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var lipsum = require("ainojs-lipsum"),

function mockChat() {
    var title = lipsum.words(_.random(1, 5));

    return {
        "iconClassnames": _.sample(iconClassnames),
        "memberListLength": _.random(1, 120),
        "messageListLength": _.random(0, 120),
        "themeClassnames": _.sample(themeClassnames),
        "title": title
    };
}

module.exports = {
    "mockChat": mockChat
};
