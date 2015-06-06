/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    express = require("express"),
    Promise = require("bluebird");

function create(container) {
    var router = express.Router();

    router.get(/^\/([a-z0-9]{24})$/, function (req, res, next) {
        req.params._id = req.params[0];

        container.facets.chatViewController.get().then(function (chatViewController) {
            return chatViewController.onHttpRequest(req, res, next);
        }).catch(next);
    });

    router.get("/", function (req, res, next) {
        req.url = "/index.html";
        next();
    });

    router.get("/index.html", function (req, res, next) {
        container.facets.indexViewController.get().then(function (indexViewController) {
            return indexViewController.onHttpRequest(req, res, next);
        }).catch(next);
    });

    router.get("/:page.html", function (req, res) {
        res.render("layout/" + req.params.page + ".html.twig");
    });

    return router;
}

module.exports = {
    "create": create
};
