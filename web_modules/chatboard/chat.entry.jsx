/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import Baobab from "baobab";
import ChatDocument from "chatboard/React/ChatDocument";
import EVENTS from "chatboard-enums/EVENTS";
import io from "socket.io-client";
import React from "react";

var chatDocumentConfig = JSON.parse(document.getElementById("ChatDocumentConfig").textContent),
    socket = io.connect("http://localhost:8063/" + chatDocumentConfig.chat._id),
    stateTree = new Baobab(chatDocumentConfig);

socket.on(EVENTS.CHTB_SERVER_CHAT_UPDATE, function (chat) {
    stateTree.set("chat", chat);
    stateTree.commit();
});

socket.on(EVENTS.CHTB_SERVER_MESSAGE, function (message) {
    stateTree.select("messageList").push(message);
    stateTree.commit();
});

function onChatColorChange(newChatColor) {
    socket.emit(EVENTS.CHTB_CLIENT_CHAT_COLOR_CHANGE, {
        "chat": chatDocumentConfig.chat,
        "newChatColor": newChatColor
    });
}

function onChatIconChange(newChatIcon) {
    socket.emit(EVENTS.CHTB_CLIENT_CHAT_ICON_CHANGE, {
        "chat": chatDocumentConfig.chat,
        "newChatIcon": newChatIcon
    });
}

function onChatTitleChange(newChatTitle) {
    socket.emit(EVENTS.CHTB_CLIENT_CHAT_TITLE_CHANGE, {
        "chat": chatDocumentConfig.chat,
        "newChatTitle": newChatTitle
    });
}

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
        onChatColorChange={onChatColorChange}
        onChatIconChange={onChatIconChange}
        onChatTitleChange={onChatTitleChange}
        onMessageSubmit={onMessageSubmit}
    ></ChatDocument>, document.body);
}

stateTree.on("update", render);
render();
