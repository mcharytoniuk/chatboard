/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var app,
    env,
    express = require("express"),
    nunjucks = require("nunjucks"),
    path = require("path");

app = express();
app.use("/assets", express.static(path.resolve(__dirname, "..", "assets")));

env = nunjucks.configure(path.resolve(__dirname, "views"));
env.express(app);

app.get("/", function (req, res) {
    res.render("index.html.twig");
});

app.listen(8063);
