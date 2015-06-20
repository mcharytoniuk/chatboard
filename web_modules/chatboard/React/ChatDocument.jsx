/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

/*eslint no-underscore-dangle: 0 */

import _ from "lodash";
import Baobab from "baobab";
import EVENTS from "chatboard-enums/EVENTS";
import io from "socket.io-client";
import MainDocument from "chatboard/React/MainDocument";
import moment from "moment";
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

        this.socket.emit(EVENTS.CHTB_CLIENT_CHAT_ROOM_JOIN_REQUEST, {
            "chat": {
                "_id": this.props.params.chatId
            }
        });
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
                return data.messageList.map(function (message) {
                    return {
                        "message": message,
                        "user": _.find(data.userList, {
                            "_id": message.userId
                        })
                    };
                });
            }
        });
        this.stateTree.on("update", () => this.forceUpdate());
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
        var messageAndUserList = this.stateTree.facets.messageAndUserList.get(),
            state = this.stateTree.get();

        return <MainDocument {...this.props} className="page-chat">
            <section className="messageList">
                {messageAndUserList.map(messageAndUser => {
                    var messageMoment = moment(messageAndUser.message.date);

                    return <article className={"type-" + messageAndUser.message.type} key={messageAndUser.message._id}>
                        <header>
                            <time dateTime={messageMoment.format("YYYY-MM-DD HH:mm")}>
                                {messageMoment.fromNow()}
                            </time>
                        </header>
                        <p>
                            {messageAndUser.message.content}
                        </p>
                    </article>;
                })}
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
        </MainDocument>;
    }
});
