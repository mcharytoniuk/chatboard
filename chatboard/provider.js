/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var _ = require("lodash"),
    Promise = require("bluebird");

module.exports = {
    "create": function (methods) {
        return function (db) {
            return _.mapValues(methods, function (method) {
                return _.bind(method, null, db);
            });
        }
    },
    "toArray": function toArray(collection) {
        return new Promise(function (resolve, reject) {
            collection.toArray(function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
};
