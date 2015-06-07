/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    Baobab = require("baobab"),
    chatPoolManager = require(path.resolve(__dirname, "..", "chatboard-sockets", "chatPoolManager")),
    chatProvider = require(path.resolve(__dirname, "..", "chatboard-mongo", "provider", "chat")),
    chatSocketController = require(path.resolve(__dirname, "..", "chatboard-sockets", "controller", "chat")),
    chatStorage = require(path.resolve(__dirname, "..", "chatboard-mongo", "storage", "chat")),
    chatViewController = require(path.resolve(__dirname, "..", "chatboard", "controller", "chat")),
    cookieParser = require("cookie-parser"),
    express = require("express"),
    eventDispatcher = require(path.resolve(__dirname, "eventDispatcher")),
    FacebookStrategy = require("passport-facebook").Strategy,
    http = require("http"),
    indexViewController = require(path.resolve(__dirname, "..", "chatboard", "controller", "index")),
    io = require("socket.io"),
    messageProvider = require(path.resolve(__dirname, "..", "chatboard-mongo", "provider", "message")),
    messageStorage = require(path.resolve(__dirname, "..", "chatboard-mongo", "storage", "message")),
    MongoClient = require("mongodb").MongoClient,
    mongoClientPromise,
    nunjucks = require("nunjucks"),
    passport = require("passport"),
    passportSocketIo = require("passport.socketio"),
    Promise = require("bluebird"),
    router = require(path.resolve(__dirname, "router")),
    session = require("express-session"),
    RedisStore = require("connect-redis")(session);

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

    container.facets.app = container.createFacet({
        "cursors": {
            "parameters": parametersCursor,
            "sessionCookieName": sessionCookieNameCursor
        },
        "facets": {
            "router": container.facets.router,
            "sessionStore": container.facets.sessionStore
        },
        "get": function (data) {
            return Promise.props(data).then(function (results) {
                var app,
                    env;

                passport.serializeUser(function (user, done) {
                    done(null, user);
                });

                passport.deserializeUser(function (user, done) {
                    done(null, user);
                });

                passport.use(new FacebookStrategy(_.merge(results.parameters.facebook, {
                    "callbackURL": "http://localhost:8063/auth/login/facebook/callback"
                }), function (accessToken, refreshToken, profile, done) {
                    done(null, profile);
                }));

                app = express();

                app.use(cookieParser(results.parameters.chatboard.secret));
                app.use(session({
                    "name": results.sessionCookieName,
                    "resave": false,
                    "saveUninitialized": false,
                    "secret": results.parameters.chatboard.secret,
                    "store": results.sessionStore
                }));
                app.use(passport.initialize());
                app.use(passport.session());

                app.get("/auth/login/facebook", passport.authenticate("facebook"));
                app.get("/auth/login/facebook/callback", passport.authenticate("facebook", {
                    "failureRedirect": "/login.html",
                    "successRedirect": "/"
                }));
                app.get("/auth/logout", function(req, res){
                    req.logout();
                    res.redirect("/");
                });

                app.use("/assets", express.static(path.resolve(__dirname, "..", "assets")));
                app.use("/", results.router);

                env = new nunjucks.Environment(new nunjucks.FileSystemLoader(path.resolve(__dirname, "views")));
                env.addFilter("json", JSON.stringify);
                env.express(app);

                return app;
            });
        }
    });

    container.facets.socketServer = container.createFacet({
        "cursors": {
            "parameters": parametersCursor,
            "sessionCookieName": sessionCookieNameCursor
        },
        "facets": {
            "app": container.facets.app,
            "sessionStore": container.facets.sessionStore
        },
        "get": function (data) {
            return Promise.props(data).then(function (results) {
                var server = http.createServer(results.app),
                    socketServer = io(server.listen(process.env.PORT || 8063));

                socketServer.use(passportSocketIo.authorize({
                    "cookieParser": cookieParser,
                    "fail": function (data, message, error, accept) {
                        accept();
                    },
                    "key": results.sessionCookieName,
                    "secret": results.parameters.chatboard.secret,
                    "store": results.sessionStore,
                    // "success": onAuthorizeSuccess
                }));

                return socketServer;
            });
        }
    });

    container.facets.chatSocketController = container.createFacet({
        "facets": {
            "chatProvider": container.facets.chatProvider,
            "chatStorage": container.facets.chatStorage,
            "messageProvider": container.facets.messageProvider,
            "messageStorage": container.facets.messageStorage,
            "socketServer": container.facets.socketServer
        },
        "get": function (data) {
            return Promise.props(data).then(function (results) {
                return chatSocketController.create(results.chatProvider, results.chatStorage, results.messageProvider, results.messageStorage, results.socketServer);
            });
        }
    });

    container.facets.chatPoolManager = container.createFacet({
        "cursors": {
            "chatPool": container.select("chatPool")
        },
        "facets": {
            "socketServer": container.facets.socketServer
        },
        "get": function (data) {
            return Promise.props(data).then(function (results) {
                return chatPoolManager.create(results.chatPool, results.socketServer)
            });
        }
    });

    container.facets.eventDispatcher = container.createFacet({
        "facets": {
            "chatPoolManager": container.facets.chatPoolManager,
            "chatSocketController": container.facets.chatSocketController
        },
        "get": function (data) {
            return Promise.props(data).then(function (results) {
                return eventDispatcher.create(results.chatPoolManager, results.chatSocketController);
            });
        }
    });

    return container;
}

module.exports = {
    "create": create
};
