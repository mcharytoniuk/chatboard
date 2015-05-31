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
    io,
    nunjucks = require("nunjucks"),
    router = require(path.resolve(__dirname, "router")),
    server,
    socketIo = require("socket.io");

app = express();

server = http.createServer(app);
io = socketIo(server);

nunjucks.configure(path.resolve(__dirname, "views"), {
    "express": app
});

app.use("/assets", express.static(path.resolve(__dirname, "..", "assets")));
app.use("/", router.create(container.create()));

app.listen(8063);
