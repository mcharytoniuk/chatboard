/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    app,
    container = require(path.resolve(__dirname, "container")),
    env,
    express = require("express"),
    http = require("http"),
    io = require("socket.io"),
    nunjucks = require("nunjucks"),
    router = require(path.resolve(__dirname, "router")),
    server,
    socketServer;

app = express();
app.use("/assets", express.static(path.resolve(__dirname, "..", "assets")));
app.use("/", router.create(container.create({})));

env = new nunjucks.Environment(new nunjucks.FileSystemLoader(path.resolve(__dirname, "views")));
env.addFilter("json", JSON.stringify);
env.express(app);

server = http.createServer(app);
socketServer = io(server.listen(8063));

socketServer.on("connection", function (socket) {
    socket.on("chat message", function (msg) {
        socketServer.emit("chat message", {
            "content": msg,
            "_id": Date.now()
        });
    });
});
