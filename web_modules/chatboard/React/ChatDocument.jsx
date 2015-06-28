/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

/*eslint no-underscore-dangle: 0 */

import _ from "lodash";
import Baobab from "baobab";
import ChatMessage from "chatboard/React/ChatMessage";
import EVENTS from "chatboard-enums/EVENTS";
import io from "socket.io-client";
import LinkToggle from "chatboard/React/LinkToggle";
import NAMESPACES from "chatboard-enums/NAMESPACES";
import React from "react";

export default React.createClass({
    "componentDidMount": function () {
        this.socket.on(EVENTS.CHTB_SERVER_CHAT_UPDATE, chat => {
            this.stateTree.set("chat", chat);
            this.stateTree.commit();
        });
        this.socket.on(EVENTS.CHTB_SERVER_MESSAGE, data => {
            this.stateTree.select("messageList").push(data.message);
            this.stateTree.select("userList").push(data.user);
            this.stateTree.commit();
        });
        this.socket.on(EVENTS.CHTB_SERVER_ROOM_JOIN_APPROVE, data => {
            this.stateTree.set("chat", data.chat);
            this.stateTree.set("messageList", data.messageList);
            this.stateTree.set("userList", data.userList);
            this.stateTree.commit();
        });

        this.componentWillReceiveProps(this.props);
    },
    "componentDidUpdate": function () {
        var node = React.findDOMNode(this.refs.messageList);

        node.scrollTop = node.scrollHeight;
    },
    "componentWillMount": function () {
        this.socket = io.connect(window.location.origin + NAMESPACES.CHAT);
        this.stateTree = new Baobab({
            "activeTab": null,
            "chat": {
            },
            "messageList": [],
            "pendingMessage": "",
            "userList": []
        }, {
            "autoCommit": false
        });
        this.stateTree.facets.messageAndUserList = this.stateTree.createFacet({
            "cursors": {
                "messageList": this.stateTree.select("messageList"),
                "userList": this.stateTree.select("userList")
            },
            "get": function (data) {
                return _(data.messageList).sortBy("date").map(function (message) {
                    return {
                        "message": message,
                        "user": _.find(data.userList, {
                            "_id": message.userId
                        })
                    };
                }).value();
            }
        });
        this.stateTree.on("update", () => this.forceUpdate());
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
    "onFormSubmit": function (evt) {
        var pendingMessage = React.findDOMNode(this.refs.messageTextInput).value;

        evt.preventDefault();

        if (!pendingMessage) {
            return;
        }

        this.stateTree.set("pendingMessage", "");
        this.stateTree.commit();

        this.onMessageSubmit(pendingMessage);
    },
    "onMessageSubmit": function (message) {
        this.socket.emit(EVENTS.CHTB_CLIENT_MESSAGE, {
            "chat": this.stateTree.get("chat"),
            "message": {
                "content": message
            }
        });
    },
    "onPendingMessageChange": function (evt) {
        evt.preventDefault();

        this.stateTree.set("pendingMessage", evt.target.value);
        this.stateTree.commit();
    },
    "propTypes": {
        "params": React.PropTypes.shape({
            "chatId": React.PropTypes.string.isRequired
        }).isRequired
    },
    "render": function () {
        var linkToggleTarget,
            messageAndUserList = this.stateTree.facets.messageAndUserList.get(),
            state = this.stateTree.get();

        linkToggleTarget = `/${state.chat._id}`;

        return <main className="page-chat">
            <nav className="settings">
                <LinkToggle to={`/${state.chat._id}/guests`} toggle={linkToggleTarget}>
                    guest list
                </LinkToggle>
                <a href="#">hashtags</a>
                <a href="#">icon</a>
                <LinkToggle to={`/${state.chat._id}/color`} toggle={linkToggleTarget}>
                    color
                </LinkToggle>
                <a href="#">privacy</a>
            </nav>

            {this.props.children}

            <section className="chatboard">
                <section className="messageList" ref="messageList">
                    {state.chat && messageAndUserList.length < 1 && (
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
                </section>

                <form onSubmit={evt => this.onFormSubmit(evt)}>
                    <input
                        autoFocus
                        onChange={evt => this.onPendingMessageChange(evt)}
                        ref="messageTextInput"
                        type="text"
                        value={state.pendingMessage}
                    ></input>
                    <button>Send</button>
                </form>
            </section>
        </main>;
    }
});
