/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var _ = require("lodash"),
    Promise = require("bluebird"),
    Rx = require("rx"),
    socketObservablesMap = new Map();

function create(chatProvider, messageProvider, socketServer) {
    return {
        "onHttpRequest": _.partial(onHttpRequest, _, _, _, chatProvider, messageProvider, socketServer)
    };
}

function createSocketServerObservable(req, socketServer) {
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

function onHttpRequest(req, res, next, chatProvider, messageProvider, socketServer) {
    return chatProvider.findOneBySlug(req.params.slug).then(function (chat) {
        if (!chat) {
            return next();
        }

        return createSocketServerObservable(req, socketServer)
            .then(function (observable) {
                return Promise.props({
                    "chat": chat,
                    "messageList": messageProvider.findByChat(chat),
                    "observable": observable
                });
            })
            .then(function (results) {
                res.render("layout/chat.html.twig", results);

                return results;
            });
    });
};

module.exports = {
    "create": create
};
