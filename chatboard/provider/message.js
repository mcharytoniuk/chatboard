/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var _ = require("lodash"),
    lipsum = require("ainojs-lipsum"),
    Promise = require("bluebird"),
    types;

types = [
    "communicate",
    "info",
    "message",
    "success",
    "warning"
];

function findByChat(db, chat) {
    return new Promise(function (resolve) {
        var messageList = _.range(25).map(function () {
            return {
                "author": lipsum.words(_.random(2, 3)),
                "content": lipsum.words(_.random(10, 25)),
                "date": new Date(),
                "type": _.sample(types)
            };
        });

        resolve(messageList);
    });
}

module.exports = {
    "create": function (db) {
        return {
            "findByChat": _.bind(findByChat, null, db)
        };
    }
};
