/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    EventEmitter2 = require("eventemitter2").EventEmitter2,
    EVENTS = require(path.resolve(__dirname, "..", "chatboard-enums", "EVENTS")),
    Promise = require("bluebird"),
    Rx = require("rx");

function create(indexSocketServer) {
    return Rx.Observable.create(function (observer) {
        indexSocketServer.on("connection", function (socket) {
            observer.onNext(socket);
        });

        indexSocketServer.on("close", function () {
            observer.onCompleted();
        });
    })
    .flatMap(function (socket) {
        return Rx.Observable.create(function (observer) {
            triggerEvent(socket, observer, EVENTS.CHTB_CLIENT_CONNECTION);

            forwardEvent(socket, observer, EVENTS.CHTB_CLIENT_CHAT_LIST_UPDATE_REQUEST);

            socket.on("disconnect", function () {
                observer.onCompleted();
            });
        });
    });
}

function forwardEvent(socket, observer, eventName) {
    socket.on(eventName, function (data, feedback) {
        triggerEvent(socket, observer, eventName, data, feedback);
    });
}

function triggerEvent(socket, observer, eventName, data, feedback) {
    observer.onNext({
        "data": data,
        "feedback": feedback,
        "name": eventName,
        "socket": socket,
        "user": socket.request.user
    });
}

module.exports = {
    "create": create
};
