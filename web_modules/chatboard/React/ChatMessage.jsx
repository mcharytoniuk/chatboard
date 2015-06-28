/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import MessagePropType from "chatboard/React/PropType/Message";
import moment from "moment";
import React from "react";
import UserPropType from "chatboard/React/PropType/User";

export default React.createClass({
    "propTypes": {
        "messageAndUser": React.PropTypes.shape({
            "message": MessagePropType.isRequired,
            "user": UserPropType.isRequired
        }).isRequired
    },
    "render": function () {
        var messageMoment = moment(this.props.messageAndUser.message.date);

        return <article className={"type-" + this.props.messageAndUser.message.type}>
            <header>
                <time dateTime={messageMoment.format("YYYY-MM-DD HH:mm")}>
                    {messageMoment.fromNow()}
                </time>
            </header>
            <p>
                {this.props.messageAndUser.message.content}
            </p>
        </article>;
    }
});
