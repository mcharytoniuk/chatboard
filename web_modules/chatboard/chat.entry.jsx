/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import ChatDocument from "chatboard/React/ChatDocument";
import io from "socket.io-client";
import React from "react";

var chatDocumentConfig = JSON.parse(document.getElementById("ChatDocumentConfig").textContent),
    socket = io.connect("http://localhost:8063");

socket.on("chat message", function (message) {
    chatDocumentConfig.messageList.push(message);

    render();
});

function onMessageSubmit(message) {
    socket.emit("chat message", message);
}

function render() {
    React.render(<ChatDocument {...chatDocumentConfig}
        onMessageSubmit={onMessageSubmit}
    ></ChatDocument>, document.body);
}

render();
