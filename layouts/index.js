/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

var path = require("path"),
    app,
    express = require("express");

app = express();
app.use("/assets", express.static(path.resolve(__dirname, "..", "assets")));
app.use("/", express.static(path.resolve(__dirname, "views")));
app.listen(8064);
