/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    autoprefixer = require("autoprefixer-core"),
    csswring = require("csswring"),
    gg = require("gore-gulp"),
    gulp = require("gulp"),
    postcss = require("gulp-postcss"),
    postcssImport = require("postcss-import"),
    postcssMixins = require("postcss-mixins"),
    postcssNested = require("postcss-nested"),
    postcssUrl = require("postcss-url"),
    rename = require("gulp-rename");

gg(__dirname).setup(gulp);

gulp.task("fonts", function () {
    return gulp.src(path.resolve(__dirname, "node_modules", "font-awesome", "fonts", "*"))
        .pipe(gulp.dest(path.resolve(__dirname, "assets", "fonts")));
});

gulp.task("css", ["fonts"], function () {
    return gulp.src(path.resolve(__dirname, "assets", "scss", "style.scss"))
        .pipe(postcss([
            postcssImport(),
            postcssMixins(),
            postcssNested(),
            autoprefixer({
                "browsers": [
                    "last 2 versions"
                ]
            })
            // csswring()
        ]))
        .pipe(rename({
            "extname": ".css"
        }))
        .pipe(gulp.dest(path.resolve(__dirname, "assets", "css")));
});

gulp.task("build", ["css", "webpack.development"]);
