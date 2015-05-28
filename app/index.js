/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    app,
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

app.get("/index.html", indexController);

app.get("/:page.html", function (req, res) {
    res.render("layout/" + req.params.page + ".html.twig");
});

app.listen(8063);
