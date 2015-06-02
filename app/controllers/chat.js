/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var _ = require("lodash"),
    Promise = require("bluebird");

function create(chatProvider, messageProvider, socketServer) {
    return {
        "onHttpRequest": _.partial(onHttpRequest, _, _, _, chatProvider, messageProvider, socketServer)
    };
}

function onHttpRequest(req, res, next, chatPoolManager, chatProvider, messageProvider) {
    return chatProvider.findOneBySlug(req.params.slug).then(function (chat) {
        if (!chat) {
            return next();
        }

        return chatPoolManager.createSocketServerObservable(req)
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
