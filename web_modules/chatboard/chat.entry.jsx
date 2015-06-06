/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import Baobab from "baobab";
import ChatDocument from "chatboard/React/ChatDocument";
import EVENTS from "chatboard-events";
import io from "socket.io-client";
import React from "react";

var chatDocumentConfig = JSON.parse(document.getElementById("ChatDocumentConfig").textContent),
    socket = io.connect("http://localhost:8063/" + chatDocumentConfig.chat.slug),
    stateTree = new Baobab(chatDocumentConfig);

socket.on(EVENTS.CHTB_SERVER_MESSAGE, function (message) {
    stateTree.select("messageList").push(message);
    stateTree.commit();
});

function onMessageSubmit(content) {
    socket.emit(EVENTS.CHTB_CLIENT_MESSAGE, {
        "chat": chatDocumentConfig.chat,
        "message": {
            "content": content
        }
    });
}

function render() {
    React.render(<ChatDocument {...stateTree.get()}
        onMessageSubmit={onMessageSubmit}
    ></ChatDocument>, document.body);
}

stateTree.on("update", render);
render();
