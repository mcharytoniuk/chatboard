/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import ChatPropType from "chatboard/React/PropType/Chat";
import React from "react";

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
        "chat": ChatPropType.isRequired
    },
    "render": function () {
        return <nav className="chatSettings chatColorSettings">
            <a href="#" onClick={this.onSetPrivateClick}>
                private ({!this.props.chat.isPublic})
            </a>
            <a href="#" onClick={this.onSetPublicClick}>
                public ({this.props.chat.isPublic})
            </a>
        </nav>;
    }
});
