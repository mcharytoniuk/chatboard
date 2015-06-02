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

    router.get("/", function (req, res, next) {
        req.url = "/index.html";
        next();
    });

    router.get("/index.html", function (req, res, next) {
        container.facets.indexController.get().then(function (indexController) {
            return indexController.onHttpRequest(req, res, next);
        }).catch(next);
    });

    router.get("/:slug.chat", function (req, res, next) {
        container.facets.chatController.get()
            .then(function (chatController) {
                return chatController.onHttpRequest(req, res, next);
            })
            .then(function (results) {
                results.observable.subscribe(function (evt) {
                    evt.namespacedSocketServer.emit("message", evt.message);
                });
            })
            .catch(next);
    });

    router.get("/:page.html", function (req, res) {
        res.render("layout/" + req.params.page + ".html.twig");
    });

    return router;
}

module.exports = {
    "create": create
};
