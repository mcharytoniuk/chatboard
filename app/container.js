/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    app = require(path.resolve(__dirname, "app")),
    Baobab = require("baobab"),
    chatPoolManager = require(path.resolve(__dirname, "..", "chatboard-sockets", "chatPoolManager")),
    chatProvider = require(path.resolve(__dirname, "..", "chatboard-mongo", "provider", "chat")),
    chatSocketController = require(path.resolve(__dirname, "..", "chatboard-sockets", "controller", "chat")),
    chatStorage = require(path.resolve(__dirname, "..", "chatboard-mongo", "storage", "chat")),
    chatViewController = require(path.resolve(__dirname, "..", "chatboard-http", "controller", "chat")),
    cookieParser = require("cookie-parser"),
    eventDispatcher = require(path.resolve(__dirname, "eventDispatcher")),
    http = require("http"),
    indexSocketController = require(path.resolve(__dirname, "..", "chatboard-sockets", "controller", "index")),
    indexViewController = require(path.resolve(__dirname, "..", "chatboard-http", "controller", "index")),
    io = require("socket.io"),
    messageProvider = require(path.resolve(__dirname, "..", "chatboard-mongo", "provider", "message")),
    messageStorage = require(path.resolve(__dirname, "..", "chatboard-mongo", "storage", "message")),
    MongoClient = require("mongodb").MongoClient,
    mongoClientPromise,
    NAMESPACES = require(path.resolve(__dirname, "..", "chatboard-enums", "NAMESPACES")),
    passportSocketIo = require("passport.socketio"),
    Promise = require("bluebird"),
    router = require(path.resolve(__dirname, "..", "chatboard-http", "router")),
    session = require("express-session"),
    RedisStore = require("connect-redis")(session),
    userProvider = require(path.resolve(__dirname, "..", "chatboard-mongo", "provider", "user")),
    userSessionManager = require(path.resolve(__dirname, "..", "chatboard-mongo", "userSessionManager")),
    userStorage = require(path.resolve(__dirname, "..", "chatboard-mongo", "storage", "user"));

function create(initialData) {
    var container = new Baobab(initialData),
        parametersCursor = container.select("parameters"),
        sessionCookieNameCursor = container.select("sessionCookieName");

    container.facets.connection = container.createFacet({
        "cursors": {
            "parameters": parametersCursor
        },
        "get": function (data) {
            return Promise.fromNode(function (cb) {
                MongoClient.connect(data.parameters.mongo.connectionString, cb);
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
        "get": function () {
            return Promise.resolve(indexViewController.create());
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
            "chatStorage": container.facets.chatStorage,
            "connection": container.facets.connection
        },
        "get": function (data) {
            return Promise.props(data).then(function (results) {
                return messageStorage.create(results.chatStorage, results.connection);
            });
        }
    });

    container.facets.sessionStore = container.createFacet({
        "cursors": {
            "parameters": parametersCursor
        },
        "get": function (data) {
            return new RedisStore(data.parameters.redis);
        }
    });

    container.facets.chatViewController = container.createFacet({
        "facets": {
            "chatProvider": container.facets.chatProvider
        },
        "get": function (data) {
            return Promise.props(data).then(function (results) {
                return chatViewController.create(results.chatProvider);
            });
        }
    });

    container.facets.router = container.createFacet({
        "facets": {
            "chatViewController": container.facets.chatViewController,
            "indexViewController": container.facets.indexViewController
        },
        "get": function (data) {
            return Promise.props(data).then(function (results) {
                return router.create(results.chatViewController, results.indexViewController);
            });
        }
    });

    container.facets.userProvider = container.createFacet({
        "facets": {
            "connection": container.facets.connection
        },
        "get": function (data) {
            return data.connection.then(function (connection) {
                return userProvider.create(connection);
            });
        }
    });

    container.facets.userStorage = container.createFacet({
        "facets": {
            "connection": container.facets.connection
        },
        "get": function (data) {
            return data.connection.then(function (connection) {
                return userStorage.create(connection);
            });
        }
    });

    container.facets.userSessionManager = container.createFacet({
        "facets": {
            "userProvider": container.facets.userProvider,
            "userStorage": container.facets.userStorage
        },
        "get": function (data) {
            return Promise.props(data).then(function (results) {
                return userSessionManager.create(results.userProvider, results.userStorage);
            });
        }
    });

    container.facets.app = container.createFacet({
        "cursors": {
            "parameters": parametersCursor,
            "sessionCookieName": sessionCookieNameCursor
        },
        "facets": {
            "router": container.facets.router,
            "sessionStore": container.facets.sessionStore,
            "userSessionManager": container.facets.userSessionManager
        },
        "get": function (data) {
            return Promise.props(data).then(function (results) {
                return app.create(results.parameters, results.router, results.sessionCookieName, results.sessionStore, results.userSessionManager);
            });
        }
    });

    container.facets.httpServer = container.createFacet({
        "facets": {
            "app": container.facets.app
        },
        "get": function (data) {
            return Promise.props(data).then(function (results) {
                var server = http.createServer(results.app);

                return server.listen(process.env.PORT || 8063);
            });
        }
    });

    container.facets.socketServer = container.createFacet({
        "cursors": {
            "parameters": parametersCursor,
            "sessionCookieName": sessionCookieNameCursor
        },
        "facets": {
            "httpServer": container.facets.httpServer,
            "sessionStore": container.facets.sessionStore
        },
        "get": function (data) {
            return Promise.props(data).then(function (results) {
                var socketServer = io(results.httpServer);

                socketServer.use(passportSocketIo.authorize({
                    "cookieParser": cookieParser,
                    "fail": function (data, message, error, accept) {
                        accept();
                    },
                    "key": results.sessionCookieName,
                    "secret": results.parameters.chatboard.secret,
                    "store": results.sessionStore
                    // "success": onAuthorizeSuccess
                }));

                return socketServer;
            });
        }
    });

    container.facets.chatSocketServer = container.createFacet({
        "facets": {
            "socketServer": container.facets.socketServer
        },
        "get": function (data) {
            return Promise.props(data).then(function (results) {
                return results.socketServer.of(NAMESPACES.CHAT);
            });
        }
    });

    container.facets.indexSocketServer = container.createFacet({
        "facets": {
            "socketServer": container.facets.socketServer
        },
        "get": function (data) {
            return Promise.props(data).then(function (results) {
                return results.socketServer.of(NAMESPACES.INDEX);
            });
        }
    });

    container.facets.chatSocketController = container.createFacet({
        "facets": {
            "chatProvider": container.facets.chatProvider,
            "chatSocketServer": container.facets.chatSocketServer,
            "chatStorage": container.facets.chatStorage,
            "messageProvider": container.facets.messageProvider,
            "messageStorage": container.facets.messageStorage,
            "userProvider": container.facets.userProvider
        },
        "get": function (data) {
            return Promise.props(data).then(function (results) {
                return chatSocketController.create(results.chatProvider, results.chatSocketServer, results.chatStorage, results.messageProvider, results.messageStorage, results.userProvider);
            });
        }
    });

    container.facets.indexSocketController = container.createFacet({
        "facets": {
            "chatProvider": container.facets.chatProvider,
            "chatSocketServer": container.facets.chatSocketServer,
            "indexSocketServer": container.facets.indexSocketServer
        },
        "get": function (data) {
            return Promise.props(data).then(function (results) {
                return indexSocketController.create(results.chatProvider, results.chatSocketServer, results.indexSocketServer);
            });
        }
    });

    container.facets.chatPoolManager = container.createFacet({
        "cursors": {
            "chatPool": container.select("chatPool")
        },
        "facets": {
            "chatSocketServer": container.facets.chatSocketServer
        },
        "get": function (data) {
            return Promise.props(data).then(function (results) {
                return chatPoolManager.create(results.chatPool, results.chatSocketServer)
            });
        }
    });

    container.facets.eventDispatcher = container.createFacet({
        "facets": {
            "chatPoolManager": container.facets.chatPoolManager,
            "chatSocketController": container.facets.chatSocketController,
            "indexSocketController": container.facets.indexSocketController
        },
        "get": function (data) {
            return Promise.props(data).then(function (results) {
                return eventDispatcher.create(results.chatPoolManager, results.chatSocketController, results.indexSocketController);
            });
        }
    });

    container.facets.logger = container.createFacet({
        "get": function () {
        }
    });

    return container;
}

module.exports = {
    "create": create
};
