/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    cookieParser = require("cookie-parser"),
    express = require("express"),
    FacebookStrategy = require("passport-facebook").Strategy,
    nunjucks = require("nunjucks"),
    passport = require("passport"),
    passportSocketIo = require("passport.socketio"),
    session = require("express-session");

function create(parameters, router, sessionCookieName, sessionStore, userSessionManager) {
    var app,
        env;

    passport.serializeUser(function (user, done) {
        userSessionManager.serializeUser(user).nodeify(done);
    });

    passport.deserializeUser(function (user, done) {
        userSessionManager.deserializeUser(user).nodeify(done);
    });

    passport.use(new FacebookStrategy(_.merge(parameters.facebook, {
        "callbackURL": parameters.chatboard.host + "/auth/login/facebook/callback"
    }), function (accessToken, refreshToken, profile, done) {
        userSessionManager.registerFacebookUser(profile).nodeify(done);
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
    app.use("/", router);

    env = new nunjucks.Environment(new nunjucks.FileSystemLoader(path.resolve(__dirname, "views")));
    env.addFilter("json", JSON.stringify);
    env.express(app);

    return app;
}

module.exports = {
    "create": create
};
