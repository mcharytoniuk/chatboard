/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

/*eslint no-underscore-dangle: 0 */

import _ from "lodash";
import ChatMessage from "chatboard/React/ChatMessage";
import ChatPropType from "chatboard/React/PropType/Chat";
import MessagePropType from "chatboard/React/PropType/Message";
import React from "react";
import UserPropType from "chatboard/React/PropType/User";

export default React.createClass({
    "componentDidUpdate": function () {
        var node = React.findDOMNode(this.refs.messageList);

        node.scrollTop = node.scrollHeight;
    },
    "propTypes": {
        "chat": ChatPropType.isRequired,
        "messageList": React.PropTypes.arrayOf(MessagePropType).isRequired,
        "userList": React.PropTypes.arrayOf(UserPropType).isRequired
    },
    "render": function () {
        var messageAndUserList = _(this.props.messageList)
            .sortBy("date")
            .map(message => Object({
                "message": message,
                "user": _.find(this.props.userList, {
                    "_id": message.userId
                })
            }))
            .value();

        return <section className="messageList" ref="messageList">
            {this.props.chat && messageAndUserList.length < 1 && (
                <article>
                    <p className="type-info">
                        Go ahead and type in your first message!
                    </p>
                </article>
            )}

            {messageAndUserList.map(messageAndUser => <ChatMessage
                key={messageAndUser.message._id}
                messageAndUser={messageAndUser}
            ></ChatMessage>)}
        </section>;
    }
});
