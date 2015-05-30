/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var _ = require("lodash");

module.exports = {
    "create": function (methods) {
        return function (db) {
            return _.mapValues(methods, function (method) {
                return _.bind(method, null, db);
            });
        }
    }
};
