/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    Baobab = require("baobab"),
    chatViewController = require(path.resolve(__dirname, "..", "chatboard", "controller", "chat")),
    chatPoolManager = require(path.resolve(__dirname, "..", "chatboard-sockets", "chatPoolManager")),
    chatProvider = require(path.resolve(__dirname, "..", "chatboard-mongo", "provider", "chat")),
    chatSocketController = require(path.resolve(__dirname, "..", "chatboard-sockets", "controller", "chat")),
    chatStorage = require(path.resolve(__dirname, "..", "chatboard-mongo", "storage", "chat")),
    indexViewController = require(path.resolve(__dirname, "..", "chatboard", "controller", "index")),
    messageProvider = require(path.resolve(__dirname, "..", "chatboard-mongo", "provider", "message")),
    messageStorage = require(path.resolve(__dirname, "..", "chatboard-mongo", "storage", "message")),
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

    container.facets.chatStorage = container.createFacet({
        "facets": {
            "connection": container.facets.connection
        },
        "get": function (data) {
            return data.connection.then(function (connection) {
                return chatStorage.create(connection);
            });
        }
    });

    container.facets.indexViewController = container.createFacet({
        "facets": {
            "chatProvider": container.facets.chatProvider
        },
        "get": function (data) {
            return data.chatProvider.then(function (chatProvider) {
                return indexViewController.create(chatProvider);
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

    container.facets.messageStorage = container.createFacet({
        "facets": {
            "connection": container.facets.connection
        },
        "get": function (data) {
            return data.connection.then(function (connection) {
                return messageStorage.create(connection);
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
            return Promise.resolve(chatPoolManager.create(data.chatPool, data.chatPoolEventEmitter, data.socketServer));
        }
    });

    container.facets.chatSocketController = container.createFacet({
        "facets": {
            "chatProvider": container.facets.chatProvider,
            "chatStorage": container.facets.chatStorage,
            "messageStorage": container.facets.messageStorage
        },
        "get": function (data) {
            return Promise.props(data).then(function (results) {
                return chatSocketController.create(results.chatProvider, results.chatStorage, results.messageStorage);
            });
        }
    });

    container.facets.chatViewController = container.createFacet({
        "facets": {
            "chatPoolManager": container.facets.chatPoolManager,
            "chatProvider": container.facets.chatProvider,
            "messageProvider": container.facets.messageProvider
        },
        "get": function (data) {
            return Promise.props(data).then(function (results) {
                return chatViewController.create(results.chatPoolManager, results.chatProvider, results.messageProvider);
            });
        }
    });

    return container;
}

module.exports = {
    "create": create
};
