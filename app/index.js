/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    app,
    chatController = require(path.resolve(__dirname, "controllers", "chat")),
    chatProvider = require(path.resolve(__dirname, "..", "chatboard", "chatProvider")),
    env,
    express = require("express"),
    indexController = require(path.resolve(__dirname, "controllers", "index")),
    nunjucks = require("nunjucks");

app = express();
app.use("/assets", express.static(path.resolve(__dirname, "..", "assets")));

env = nunjucks.configure(path.resolve(__dirname, "views"));
env.express(app);

app.get("/", function (req, res, next) {
    req.url = "/index.html";
    next();
});

app.get("/index.html", function (req, res) {
    indexController(req, res, chatProvider);
});

app.get("/chat/:slug.html", function (req, res) {
    chatController(req, res, chatProvider);
});

app.get("/:page.html", function (req, res) {
    res.render("layout/" + req.params.page + ".html.twig");
});

app.listen(8063);
