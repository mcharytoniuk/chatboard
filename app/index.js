/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    app,
    container = require(path.resolve(__dirname, "container")),
    express = require("express"),
    http = require("http"),
    io = require("socket.io"),
    nunjucks = require("nunjucks"),
    router = require(path.resolve(__dirname, "router")),
    server;

app = express();

server = http.createServer(app);

nunjucks.configure(path.resolve(__dirname, "views"), {
    "express": app
});

app.use("/assets", express.static(path.resolve(__dirname, "..", "assets")));
app.use("/", router.create(container.create({
    "io": io(server)
})));

app.listen(8063);
