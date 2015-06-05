/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    EVENTS = require(path.resolve(__dirname, "..", "chatboard-events")),
    Rx = require("rx");

function create(chatPool, chatPoolEventEmitter, socketServer) {
    return {
        "createGetSocketServerObservable": _.partial(createGetSocketServerObservable, chatPool, chatPoolEventEmitter, socketServer, _)
    };
}

function createSocketServerObservable(socketServer, slug) {
    return Rx.Observable.create(function (observer) {
        var namespacedSocketServer = socketServer.of("/" + slug);

        namespacedSocketServer.on("connection", function (socket) {
            observer.onNext({
                "namespacedSocketServer": namespacedSocketServer,
                "socket": socket
            });
        });
    })
    .flatMap(function (namespacedSocketServerAndSocket) {
        return Rx.Observable.create(function (observer) {
            namespacedSocketServerAndSocket.socket.on("disconnect", function () {
                observer.onCompleted();
            });

            namespacedSocketServerAndSocket.socket.on(EVENTS.CLIENT_MESSAGE, function (data, feedback) {
                observer.onNext(_.merge(namespacedSocketServerAndSocket, {
                    "data": data,
                    "feedback": feedback
                }));
            });
        });
    });
}

function createGetSocketServerObservable(chatPool, chatPoolEventEmitter, socketServer, req) {
    var slug = req.params.slug;

    if (!chatPool[slug]) {
        chatPool[slug] = createSocketServerObservable(socketServer, slug).subscribe(function (message) {
            chatPoolEventEmitter.emit(EVENTS.CLIENT_MESSAGE, message);
        });
    }

    return Promise.resolve(chatPool[slug]);
}

module.exports = {
    "create": create
};
