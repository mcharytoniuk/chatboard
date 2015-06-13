/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var _ = require("lodash"),
    Promise = require("bluebird");

function create(userProvider, userStorage) {
    return {
        "deserializeUser": _.partial(deserializeUser, userProvider, _),
        "registerFacebookUser": _.partial(registerFacebookUser, userProvider, userStorage, _),
        "serializeUser": _.partial(serializeUser, _)
    };
}

function deserializeUser(userProvider, _id) {
    return userProvider.findOneById(_id);
}

function serializeUser(user) {
    return Promise.resolve(user._id);
}

function registerFacebookUser(userProvider, userStorage, user) {
    return userProvider.findOneByFacebookUser(user)
        .then(function (storedUser) {
            if (storedUser) {
                return storedUser;
            }

            return userStorage.insertUsingFacebookUser(user).then(function () {
                return userProvider.findOneByFacebookUser(user);
            });
        });
}

module.exports = {
    "create": create
};
