/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var lipsum = require("ainojs-lipsum"),
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

module.exports = {
    "mockMessage": mockMessage
};
