/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    app,
    container = require(path.resolve(__dirname, "container")),
    containerInstance,
    env,
    express = require("express"),
    fs = require("fs"),
    http = require("http"),
    io = require("socket.io"),
    nunjucks = require("nunjucks"),
    parametersFilePath = path.resolve(__dirname, "..", "parameters.json"),
    router = require(path.resolve(__dirname, "router")),
    server,
    socketServer;

containerInstance = container.create();

function onParametersChange() {
    fs.readFile(parametersFilePath, function (err, data) {
        data = JSON.parse(data.toString());

        containerInstance.set("parameters", data);
        containerInstance.commit();
    });
}

fs.watch(parametersFilePath, onParametersChange);
onParametersChange();

app = express();
app.use("/assets", express.static(path.resolve(__dirname, "..", "assets")));
app.use("/", router.create(containerInstance));

env = new nunjucks.Environment(new nunjucks.FileSystemLoader(path.resolve(__dirname, "views")));
env.addFilter("json", JSON.stringify);
env.express(app);

server = http.createServer(app);
socketServer = io(server.listen(process.env.PORT || 8063));

containerInstance.set("socketServer", socketServer);
containerInstance.commit();
