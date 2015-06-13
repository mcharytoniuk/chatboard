/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var _ = require("lodash"),
    Promise = require("bluebird");

function create() {
    return {
        "onHttpRequest": _.partial(onHttpRequest, _, _, _)
    };
}

function onHttpRequest(req, res) {
    return new Promise(function () {
        res.render("layout/index.html.twig", {
            "chatList": [],
            "user": req.user
        });
    });
}

module.exports = {
    "create": create
};
