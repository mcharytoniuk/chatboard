/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var express = require("express"),
    Promise = require("bluebird");

function create(chatViewController, indexViewController) {
    var router = express.Router();

    router.get(/^\/([a-z0-9]{24})$/, function (req, res, next) {
        req.params._id = req.params[0];

        chatViewController.onHttpRequest(req, res, next).catch(next);
    });

    router.get("/", function (req, res, next) {
        indexViewController.onHttpRequest(req, res, next).catch(next);
    });

    router.get("/:page", function (req, res) {
        res.render("layout/" + req.params.page + ".html.twig");
    });

    return router;
}

module.exports = {
    "create": create
};
