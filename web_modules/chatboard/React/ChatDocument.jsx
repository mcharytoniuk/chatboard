/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

/*eslint no-underscore-dangle: 0 */

import ChatMessageList from "chatboard/React/ChatMessageList";
import EVENTS from "chatboard-enums/EVENTS";
import io from "socket.io-client";
import LinkToggle from "chatboard/React/LinkToggle";
import NAMESPACES from "chatboard-enums/NAMESPACES";
import PreloaderDocument from "chatboard/React/PreloaderDocument";
import React from "react";

export default React.createClass({
    "componentDidMount": function () {
        this.socket.on(EVENTS.CHTB_SERVER_CHAT_UPDATE, chat => {
            this.setState({
                "chat": chat
            });
        });
        this.socket.on(EVENTS.CHTB_SERVER_MESSAGE, data => {
            this.setState({
                "messageList": this.state.messageList.concat(data.message),
                "userList": this.state.userList.concat(data.message)
            });
        });
        this.socket.on(EVENTS.CHTB_SERVER_ROOM_JOIN_APPROVE, data => {
            this.setState({
                "chat": data.chat,
                "messageList": data.messageList,
                "userList": data.userList
            });
        });

        this.componentWillReceiveProps(this.props);
    },
    "componentWillMount": function () {
        this.socket = io.connect(window.location.origin + NAMESPACES.CHAT);
    },
    "componentWillReceiveProps": function (nextProps) {
        if (nextProps.params.chatId === this.props.params.chatId) {
            this.socket.emit(EVENTS.CHTB_CLIENT_CHAT_ROOM_JOIN_REQUEST, {
                "chat": {
                    "_id": nextProps.params.chatId
                }
            });
        }
    },
    "getInitialState": function () {
        return {
            "chat": null,
            "messageList": [],
            "pendingMessage": "",
            "userList": []
        };
    },
    "onFormSubmit": function (evt) {
        var pendingMessage = React.findDOMNode(this.refs.messageTextInput).value;

        evt.preventDefault();

        if (!pendingMessage) {
            return;
        }

        this.setState({
            "pendingMessage": ""
        });

        this.onMessageSubmit(pendingMessage);
    },
    "onMessageSubmit": function (message) {
        this.socket.emit(EVENTS.CHTB_CLIENT_MESSAGE, {
            "chat": this.state.chat,
            "message": {
                "content": message
            }
        });
    },
    "onPendingMessageChange": function (evt) {
        evt.preventDefault();

        this.setState({
            "pendingMessage": evt.target.value
        });
    },
    "propTypes": {
        "children": React.PropTypes.element,
        "params": React.PropTypes.shape({
            "chatId": React.PropTypes.string.isRequired
        }).isRequired
    },
    "render": function () {
        var linkToggleTarget;

        if (!this.state.chat) {
            return <PreloaderDocument />;
        }

        linkToggleTarget = `/${this.state.chat._id}`;

        return <main className="page-chat">
            <nav className="settings">
                <LinkToggle to={`${linkToggleTarget}/guests`} toggle={linkToggleTarget}>
                    guest list
                </LinkToggle>
                <a href="#">hashtags</a>
                <a href="#">icon</a>
                <LinkToggle to={`${linkToggleTarget}/color`} toggle={linkToggleTarget}>
                    color
                </LinkToggle>
                <LinkToggle to={`${linkToggleTarget}/privacy`} toggle={linkToggleTarget}>
                    privacy
                </LinkToggle>
            </nav>

            {this.props.children && React.cloneElement(React.Children.only(this.props.children), {
                "chat": this.state.chat,
                "socket": this.socket
            })}

            <section className="chatboard">
                <ChatMessageList
                    chat={this.state.chat}
                    messageList={this.state.messageList}
                    userList={this.state.userList}
                ></ChatMessageList>

                <form onSubmit={evt => this.onFormSubmit(evt)}>
                    <input
                        autoFocus
                        onChange={evt => this.onPendingMessageChange(evt)}
                        ref="messageTextInput"
                        type="text"
                        value={this.state.pendingMessage}
                    ></input>
                    <button>Send</button>
                </form>
            </section>
        </main>;
    }
});
