/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    app,
    container = require(path.resolve(__dirname, "container")),
    containerInstance,
    cookieParser = require("cookie-parser"),
    env,
    eventDispatcher = require(path.resolve(__dirname, "eventDispatcher")),
    EventEmitter2 = require("eventemitter2").EventEmitter2,
    express = require("express"),
    FacebookStrategy = require("passport-facebook").Strategy,
    fs = require("fs"),
    http = require("http"),
    io = require("socket.io"),
    nunjucks = require("nunjucks"),
    parametersFilePath = path.resolve(__dirname, "..", "parameters.json"),
    passport = require("passport"),
    passportSocketIo = require("passport.socketio"),
    router = require(path.resolve(__dirname, "router")),
    server,
    session = require("express-session"),
    RedisStore = require("connect-redis")(session),
    socketServer;

containerInstance = container.create({
    "chatPool": {},
    "chatPoolEventEmitter": new EventEmitter2()
});

function onParametersChange() {
    fs.readFile(parametersFilePath, function (err, data) {
        data = JSON.parse(data.toString());

        containerInstance.set("parameters", data);
        containerInstance.commit();
    });
}

containerInstance.select("parameters").on("update", function () {
    var parameters = containerInstance.get("parameters"),
        sessionCookieName = "chatboard.sid",
        sessionStore = new RedisStore(parameters.redis);

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    passport.use(new FacebookStrategy(_.merge(parameters.facebook, {
        "callbackURL": "http://localhost:8063/auth/login/facebook/callback"
    }), function (accessToken, refreshToken, profile, done) {
        done(null, profile);
    }));

    app = express();

    app.use(cookieParser(parameters.chatboard.secret));
    app.use(session({
        "name": sessionCookieName,
        "resave": false,
        "saveUninitialized": false,
        "secret": parameters.chatboard.secret,
        "store": sessionStore
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
    app.use("/", router.create(containerInstance));

    env = new nunjucks.Environment(new nunjucks.FileSystemLoader(path.resolve(__dirname, "views")));
    env.addFilter("json", JSON.stringify);
    env.express(app);

    server = http.createServer(app);

    socketServer = io(server.listen(process.env.PORT || 8063));
    socketServer.use(passportSocketIo.authorize({
        "cookieParser": cookieParser,
        "fail": function (data, message, error, accept) {
            accept();
        },
        "key": sessionCookieName,
        "secret": parameters.chatboard.secret,
        "store": sessionStore,
        // "success": onAuthorizeSuccess
    }));

    containerInstance.set("socketServer", socketServer);
    containerInstance.commit();
});

fs.watch(parametersFilePath, onParametersChange);
onParametersChange();

eventDispatcher.create(containerInstance);
