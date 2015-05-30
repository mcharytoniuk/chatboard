/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var _ = require("lodash"),
    Promise = require("bluebird");

module.exports = function (req, res, next, chatProvider, messageProvider) {
    chatProvider.findBySlug(req.params.slug)
        .then(function (chatList) {
            return _.first(chatList);
        })
        .then(function (chat) {
            return Promise.props({
                "chat": chat,
                "messageList": messageProvider.findByChat(chat)
            });
        })
        .then(function (results) {
            res.render("layout/chat.html.twig", results);
        })
        .catch(next);
};
