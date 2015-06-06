/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    EVENTS = require(path.resolve(__dirname, "..", "chatboard-events")),
    Promise = require("bluebird"),
    Rx = require("rx");

function create(chatPool, chatPoolEventEmitter, socketServer) {
    return {
        "createGetSocketServerObservable": _.partial(createGetSocketServerObservable, chatPool, chatPoolEventEmitter, socketServer, _)
    };
}

function createSocketServerObservable(chatPoolEventEmitter, socketServer, slug) {
    return Rx.Observable.create(function (observer) {
        var namespacedSocketServer = socketServer.of("/" + slug);

        namespacedSocketServer.on("connection", function (socket) {
            var namespacedSocketServerAndSocket = {
                "namespacedSocketServer": namespacedSocketServer,
                "socket": socket
            };

            chatPoolEventEmitter.emit(EVENTS.CHTB_CLIENT_CONNECTION, namespacedSocketServerAndSocket);
            observer.onNext(namespacedSocketServerAndSocket);
        });
    })
    .flatMap(function (namespacedSocketServerAndSocket) {
        return Rx.Observable.create(function (observer) {
            namespacedSocketServerAndSocket.socket.on("disconnect", function () {
                chatPoolEventEmitter.emit(EVENTS.CHTB_CLIENT_DISCONNECT, namespacedSocketServerAndSocket);
                observer.onCompleted();
            });

            namespacedSocketServerAndSocket.socket.on(EVENTS.CHTB_CLIENT_MESSAGE, function (data, feedback) {
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

    if (!chatPool.has(slug)) {
        chatPool.set(slug, createSocketServerObservable(chatPoolEventEmitter, socketServer, slug).subscribe(function (message) {
            chatPoolEventEmitter.emit(EVENTS.CHTB_CLIENT_MESSAGE, message);
        }));
    }

    return Promise.resolve(chatPool[slug]);
}

module.exports = {
    "create": create
};
