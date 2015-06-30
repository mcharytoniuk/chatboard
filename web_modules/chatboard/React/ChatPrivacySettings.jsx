/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import classnames from "classnames";
import ChatPropType from "chatboard/React/PropType/Chat";
import React from "react";
import SocketPropType from "chatboard/React/PropType/Socket";

export default React.createClass({
    "onSetPrivateClick": function (evt) {
        evt.preventDefault();

        console.log("onSetPrivateClick");
    },
    "onSetPublicClick": function (evt) {
        evt.preventDefault();

        console.log("onSetPublicClick");
    },
    "propTypes": {
        "chat": ChatPropType.isRequired,
        "socket": SocketPropType.isRequired
    },
    "render": function () {
        return <nav className="chatSettings chatColorSettings">
            <a className={classnames({
                "active": !this.props.chat.isPublic
            })} href="#" onClick={this.onSetPrivateClick}>
                private ({!this.props.chat.isPublic})
            </a>
            <a className={classnames({
                "active": this.props.chat.isPublic
            })} href="#" onClick={this.onSetPublicClick}>
                public ({this.props.chat.isPublic})
            </a>
        </nav>;
    }
});
