/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var _ = require("lodash"),
    Promise = require("bluebird");

function create(chatProvider) {
    return {
        "onHttpRequest": _.partial(onHttpRequest, _, _, _, chatProvider)
    };
}

function onHttpRequest(req, res, next, chatProvider) {
    return chatProvider.findOneById(req.params._id).then(function (chat) {
        if (!chat) {
            return next();
        }

        return new Promise(function (resolve, reject) {
            res.on("close", reject);
            res.on("finish", resolve);

            res.render("layout/chat.html.twig", {
                "chat": chat
            });
        });
    });
};

module.exports = {
    "create": create
};
