/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var _ = require("lodash"),
    Rx = require("rx"),
    socketObservablesMap = new Map();

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

            namespacedSocketServerAndSocket.socket.on("message", function (message, feedback) {
                observer.onNext(_.merge(namespacedSocketServerAndSocket, {
                    "feedback": feedback,
                    "message": message
                }));
            });
        });
    });
}

function createGetSocketServerObservable(chatPool, chatPoolEventEmitter, socketServer, req) {
    var slug = req.params.slug;

    if (!chatPool.has(slug)) {
        chatPool.set(slug, createSocketServerObservable(socketServer, slug).subscribe(function (message) {
            chatPoolEventEmitter.emit("message", message);
        }));
    }

    return Promise.resolve(chatPool.get(slug));
}

module.exports = {
    "create": create
};
