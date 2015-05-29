/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var _ = require("lodash");

module.exports = function (req, res, chatProvider) {
    chatProvider.findBySlug(req.params.slug).then(function (chatList) {
        res.render("layout/chat.html.twig", {
            "chat": _.first(chatList)
        });
    });
};
