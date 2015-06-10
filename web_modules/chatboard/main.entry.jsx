/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import Baobab from "baobab";
import EVENTS from "chatboard-enums/EVENTS";
import io from "socket.io-client";
import MainDocument from "chatboard/React/MainDocument";
import React from "react";

var mainDocumentConfig = JSON.parse(document.getElementById("MainDocumentConfig").textContent),
    socket = io.connect(window.location.origin),
    stateTree = new Baobab(mainDocumentConfig);

socket.on(EVENTS.CHTB_SERVER_CHAT_LIST_UPDATE, function (chatList) {
    stateTree.set("chatList", chatList);
    stateTree.commit();
});

socket.on(EVENTS.CHTB_SERVER_USER_UPDATE, function (user) {
    stateTree.set("user", user);
    stateTree.commit();
});

function onUserDisplayNameChange(newDisplayName) {
}

function render() {
    React.render(<MainDocument {...stateTree.get()}
        onUserDisplayNameChange={onUserDisplayNameChange}
    ></MainDocument>, document.body);
}

stateTree.on("update", render);
render();
