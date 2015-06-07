/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    EVENTS = require(path.resolve(__dirname, "..", "chatboard-enums", "EVENTS")),
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
            function forwardEvent(eventName) {
                namespacedSocketServerAndSocket.socket.on(eventName, function (data, feedback) {
                    chatPoolEventEmitter.emit(eventName, _.merge(namespacedSocketServerAndSocket, {
                        "data": data,
                        "feedback": feedback,
                        "user": namespacedSocketServerAndSocket.socket.request.user
                    }));
                });
            }

            forwardEvent(EVENTS.CHTB_CLIENT_CHAT_COLOR_CHANGE);
            forwardEvent(EVENTS.CHTB_CLIENT_CHAT_ICON_CHANGE);
            forwardEvent(EVENTS.CHTB_CLIENT_CHAT_TITLE_CHANGE);
            forwardEvent(EVENTS.CHTB_CLIENT_MESSAGE);

            namespacedSocketServerAndSocket.socket.on("disconnect", function () {
                chatPoolEventEmitter.emit(EVENTS.CHTB_CLIENT_DISCONNECT, namespacedSocketServerAndSocket);
                observer.onCompleted();
            });
        });
    });
}

function createGetSocketServerObservable(chatPool, chatPoolEventEmitter, socketServer, req) {
    var slug = req.params._id;

    if (!chatPool[slug]) {
        chatPool[slug] = createSocketServerObservable(chatPoolEventEmitter, socketServer, slug).subscribe();
    }

    return Promise.resolve(chatPool[slug]);
}

module.exports = {
    "create": create
};
