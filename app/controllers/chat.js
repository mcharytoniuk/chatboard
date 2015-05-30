/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var _ = require("lodash"),
    Promise = require("bluebird");

module.exports = function (req, res, next, chatProvider, messageProvider) {
    chatProvider.findOneBySlug(req.params.slug)
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
