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

socket.on(EVENTS.SERVER_MESSAGE, function (message) {
    stateTree.select("messageList").push(message);
    stateTree.commit();
});

function onMessageSubmit(message) {
    socket.emit(EVENTS.CLIENT_MESSAGE, message);
}

function render() {
    React.render(<ChatDocument {...stateTree.get()}
        onMessageSubmit={onMessageSubmit}
    ></ChatDocument>, document.body);
}

stateTree.on("update", render);
render();
