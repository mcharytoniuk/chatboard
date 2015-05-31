/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var _ = require("lodash"),
    Promise = require("bluebird"),
    socketServerListenerMap = new Map();

function createSocketServerNamespace(req, socketServer) {
    function listener(socket) {
        socket.on("chat message", function (msg) {
            socketServerListenerMap.get(req.params.slug).emit("chat message", {
                "content": msg
            });
        });
    }

    return new Promise(function (resolve, reject) {
        if (!socketServerListenerMap.has(req.params.slug)) {
            socketServerListenerMap.set(req.params.slug, socketServer.of("/" + req.params.slug));
            socketServerListenerMap.get(req.params.slug).on("connection", listener);
        }

        resolve();
    });
}

module.exports = function (req, res, next, chatProvider, messageProvider, socketServer) {
    chatProvider.findOneBySlug(req.params.slug)
        .then(function (chat) {
            if (!chat) {
                return next();
            }

            return createSocketServerNamespace(req, socketServer)
                .then(function () {
                    return Promise.props({
                        "chat": chat,
                        "messageList": messageProvider.findByChat(chat)
                    });
                })
                .then(function (results) {
                    res.render("layout/chat.html.twig", results);
                });
        })
        .catch(next);
};
