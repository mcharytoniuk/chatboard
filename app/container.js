/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    Baobab = require("baobab"),
    chatProvider = require(path.resolve(__dirname, "..", "chatboard", "provider", "chat")),
    messageProvider = require(path.resolve(__dirname, "..", "chatboard", "provider", "message")),
    MongoClient = require("mongodb").MongoClient,
    mongoClientPromise,
    Promise = require("bluebird");

function create(initialData) {
    var container = new Baobab(initialData);

    container.facets.connection = container.createFacet({
        "get": function () {
            return Promise.fromNode(function (cb) {
                MongoClient.connect("mongodb://192.168.59.103:27017/chatboard", cb);
            });
        }
    });

    container.facets.chatProvider = container.createFacet({
        "facets": {
            "connection": container.facets.connection
        },
        "get": function (data) {
            return data.connection.then(function (connection) {
                return chatProvider.create(connection);
            })
        }
    });

    container.facets.messageProvider = container.createFacet({
        "facets": {
            "connection": container.facets.connection
        },
        "get": function (data) {
            return data.connection.then(function (connection) {
                return messageProvider.create(connection);
            });
        }
    });

    return container;
}

module.exports = {
    "create": create
};
