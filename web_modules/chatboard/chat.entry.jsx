/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import ChatDocument from "chatboard/React/ChatDocument";
import io from "socket.io-client";
import React from "react";

var socket = io.connect("http://localhost:8063");

socket.on("chat message", function () {
    console.log(arguments);
});

React.render(<ChatDocument chat={{}} messages={[]} />, document.body);
