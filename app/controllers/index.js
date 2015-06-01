/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var _ = require("lodash");

function create(chatProvider) {
    return {
        "onHttpRequest": _.partial(onHttpRequest, _, _, _, chatProvider)
    };
}

function onHttpRequest(req, res, next, chatProvider) {
    return chatProvider.find(25).then(function (chatList) {
        res.render("layout/index.html.twig", {
            "chatList": chatList
        });
    });
}

module.exports = {
    "create": create
};
