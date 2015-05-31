/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    chatController = require(path.resolve(__dirname, "controllers", "chat")),
    chatProvider = require(path.resolve(__dirname, "..", "chatboard", "provider", "chat")),
    express = require("express"),
    indexController = require(path.resolve(__dirname, "controllers", "index")),
    messageProvider = require(path.resolve(__dirname, "..", "chatboard", "provider", "message")),
    MongoClient = require("mongodb").MongoClient,
    mongoClientPromise,
    Promise = require("bluebird"),
    router = express.Router();

mongoClientPromise = new Promise(function (resolve, reject) {
    MongoClient.connect("mongodb://192.168.59.103:27017/chatboard", function (err, db) {
        if (err) {
            reject(err);
        } else {
            resolve(db);
        }
    });
});

router.get("/", function (req, res, next) {
    req.url = "/index.html";
    next();
});

router.get("/index.html", function (req, res, next) {
    mongoClientPromise.then(function (db) {
        indexController(req, res, next, chatProvider.create(db));
    }).catch(next);
});

router.get("/:slug.chat", function (req, res, next) {
    mongoClientPromise.then(function (db) {
        chatController(req, res, next, chatProvider.create(db), messageProvider.create(db));
    }).catch(next);
});

router.get("/:page.html", function (req, res) {
    res.render("layout/" + req.params.page + ".html.twig");
});

module.exports = router;
