/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import classnames from "classnames";
import ChatPropType from "chatboard/React/PropType/Chat";
import EVENTS from "chatboard-enums/EVENTS";
import React from "react";
import SocketPropType from "chatboard/React/PropType/Socket";

export default React.createClass({
    "onSetPrivateClick": function (evt) {
        evt.preventDefault();

        this.setChatPrivacy(true);
    },
    "onSetPublicClick": function (evt) {
        evt.preventDefault();

        this.setChatPrivacy(false);
    },
    "propTypes": {
        "chat": ChatPropType.isRequired,
        "socket": SocketPropType.isRequired
    },
    "render": function () {
        return <nav className="chatSettings chatColorSettings">
            <a className={classnames({
                "active": this.props.chat.isPrivate
            })} href="#" onClick={this.onSetPrivateClick}>
                private
            </a>
            <a className={classnames({
                "active": !this.props.chat.isPrivate
            })} href="#" onClick={this.onSetPublicClick}>
                public
            </a>
        </nav>;
    },
    "setChatPrivacy": function (newChatPrivacy) {
        this.props.socket.emit(EVENTS.CHTB_CLIENT_CHAT_PRIVACY_CHANGE, {
            "chat": this.props.chat,
            "newChatPrivacy": newChatPrivacy
        });
    }
});
