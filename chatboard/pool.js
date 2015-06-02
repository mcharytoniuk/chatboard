/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var _ = require("lodash"),
    Rx = require("rx"),
    socketObservablesMap = new Map();

function create(socketServer) {
    return {
        "createSocketServerObservable": _.partial(createSocketServerObservable, socketServer, _)
    };
}

function createSocketServerObservable(socketServer, req) {
    var observable;

    if (socketObservablesMap.has(req.params.slug)) {
        return Promise.resolve(socketObservablesMap.get(req.params.slug));
    }

    observable = Rx.Observable.create(function (observer) {
            var namespacedSocketServer = socketServer.of("/" + req.params.slug);

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

                namespacedSocketServerAndSocket.socket.on("message", function (message) {
                    observer.onNext(_.merge(namespacedSocketServerAndSocket, {
                        "message": message
                    }));
                });
            });
        });

    socketObservablesMap.set(req.params.slug, observable);

    return Promise.resolve(observable);
}

module.exports = {
    "create": create
};
