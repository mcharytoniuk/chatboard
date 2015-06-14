/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var _ = require("lodash"),
    Promise = require("bluebird");

function create(chatStorage) {
    return {
        "onHttpRequest": _.partial(onHttpRequest, _, _, _, chatStorage)
    };
}

function onHttpRequest(req, res, next, chatStorage) {
    return new Promise(function (resolve, reject) {
        res.on("close", reject);
        res.on("finish", resolve);

        chatStorage.insert().then(function (result) {
            res.json({
                "error": null,
                "result": result
            });
        });
    });
};

module.exports = {
    "create": create
};
