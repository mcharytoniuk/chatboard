/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

function isDevelopment() {
    return process.env.NODE_ENV !== "production";
}

module.exports = {
    "isDevelopment": isDevelopment
};
