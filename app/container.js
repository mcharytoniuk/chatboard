/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    Baobab = require("baobab"),
    chatController = require(path.resolve(__dirname, "..", "chatboard", "controllers", "chat")),
    chatPoolManager = require(path.resolve(__dirname, "..", "chatboard", "chatPoolManager")),
    chatProvider = require(path.resolve(__dirname, "..", "chatboard", "provider", "chat")),
    indexController = require(path.resolve(__dirname, "..", "chatboard", "controllers", "index")),
    messageProvider = require(path.resolve(__dirname, "..", "chatboard", "provider", "message")),
    MongoClient = require("mongodb").MongoClient,
    mongoClientPromise,
    Promise = require("bluebird");

function create(initialData) {
    var container = new Baobab(initialData);

    container.facets.connection = container.createFacet({
        "cursors": {
            "connectionString": container.select("parameters", "mongo", "connectionString")
        },
        "get": function (data) {
            return Promise.fromNode(function (cb) {
                MongoClient.connect(data.connectionString, cb);
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

    container.facets.indexController = container.createFacet({
        "facets": {
            "chatProvider": container.facets.chatProvider
        },
        "get": function (data) {
            return data.chatProvider.then(function (chatProvider) {
                return indexController.create(chatProvider);
            });
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

    container.facets.chatPoolManager = container.createFacet({
        "cursors": {
            "chatPool": container.select("chatPool"),
            "chatPoolEventEmitter": container.select("chatPoolEventEmitter"),
            "socketServer": container.select("socketServer")
        },
        "get": function (data) {
            return chatPoolManager.create(data.chatPool, data.chatPoolEventEmitter, data.socketServer);
        }
    });

    container.facets.chatController = container.createFacet({
        "facets": {
            "chatPoolManager": container.facets.chatPoolManager,
            "chatProvider": container.facets.chatProvider,
            "messageProvider": container.facets.messageProvider
        },
        "get": function (data) {
            return Promise.props(data).then(function (results) {
                return chatController.create(results.chatPoolManager, results.chatProvider, results.messageProvider);
            });
        }
    });

    return container;
}

module.exports = {
    "create": create
};
