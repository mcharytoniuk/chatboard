/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    chatController = require(path.resolve(__dirname, "controllers", "chat")),
    express = require("express"),
    indexController = require(path.resolve(__dirname, "controllers", "index")),
    Promise = require("bluebird");

function create(container) {
    var router = express.Router();

    router.get("/", function (req, res, next) {
        req.url = "/index.html";
        next();
    });

    router.get("/index.html", function (req, res, next) {
        container.facets.chatProvider.get().then(function (chatProvider) {
            indexController(req, res, next, chatProvider);
        }).catch(next);
    });

    router.get("/:slug.chat", function (req, res, next) {
        Promise.resolve([
            container.facets.chatProvider.get(),
            container.get("io"),
            container.facets.messageProvider.get(),
        ]).spread(function (chatProvider, io, messageProvider) {
            chatController(req, res, next, chatProvider, io, messageProvider);
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
