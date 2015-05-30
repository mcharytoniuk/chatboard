/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var _ = require("lodash");

module.exports = function (req, res, next, chatProvider) {
    chatProvider.find(25)
        .then(function (chatList) {
            res.render("layout/index.html.twig", {
                "chatList": chatList
            });
        })
        .catch(next);
};
