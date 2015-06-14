/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    gg = require("gore-gulp"),
    gulp = require("gulp"),
    postcss = require("gulp-postcss"),
    postcssImport = require("postcss-import"),
    postcssUrl = require("postcss-url"),
    rename = require("gulp-rename");

gg(__dirname).setup(gulp);

gulp.task("font-awesome", function () {
    return gulp.src(path.resolve(__dirname, "node_modules", "font-awesome", "fonts", "*"))
        .pipe(gulp.dest(path.resolve(__dirname, "assets", "fonts")));
});

gulp.task("ionicons-pre", function () {
    return gulp.src(path.resolve(__dirname, "node_modules", "ionicons-pre", "fonts", "*"))
        .pipe(gulp.dest(path.resolve(__dirname, "assets", "fonts")));
});

gulp.task("fonts", ["font-awesome", "ionicons-pre"]);

gulp.task("sass", ["fonts"], function () {
    return gulp.src(path.resolve(__dirname, "assets", "scss", "style.scss"))
        .pipe(postcss([
            postcssImport()
        ]))
        .pipe(rename({
            "extname": ".css"
        }))
        .pipe(gulp.dest(path.resolve(__dirname, "assets", "css")));
});
