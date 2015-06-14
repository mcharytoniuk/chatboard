/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var express = require("express"),
    Promise = require("bluebird");

function create(chatApiController) {
    var router = express.Router();

    router.post("/chat", function (req, res, next) {
        chatApiController.onHttpRequest(req, res, next).catch(next);
    });

    return router;
}

module.exports = {
    "create": create
};
