/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

/*eslint no-underscore-dangle: 0 */

import _ from "lodash";
import Baobab from "baobab";
// import ChatPropType from "chatboard/React/PropType/Chat";
import classnames from "classnames";
import ColorSettings from "chatboard/React/ChatDocument/ColorSettings";
import EVENTS from "chatboard-enums/EVENTS";
import IconSettings from "chatboard/React/ChatDocument/IconSettings";
import io from "socket.io-client";
import MainDocument from "chatboard/React/MainDocument";
// import MessagePropType from "chatboard/React/PropType/Message";
// import moment from "moment";
import NAMESPACES from "chatboard-enums/NAMESPACES";
import onToggleActiveTabClick from "chatboard/React/onToggleActiveTabClick";
import PrivacySettings from "chatboard/React/ChatDocument/PrivacySettings";
import React from "react";
import TitleSettings from "chatboard/React/ChatDocument/TitleSettings";
import UserList from "chatboard/React/ChatDocument/UserList";
// import UserPropType from "chatboard/React/PropType/User";
import {Link} from "react-router";

export default class ChatDocument extends React.Component {
    componentWillMount() {
        this.socket = io.connect(window.location.origin + NAMESPACES.CHAT);
    }

    componentDidMount() {
        this.socket.on(EVENTS.CHTB_SERVER_CHAT_UPDATE, chat => {
            this.stateTree.set("chat", chat);
            this.stateTree.commit();
        });
        this.socket.on(EVENTS.CHTB_SERVER_MESSAGE, data => {
            console.log(data);
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
    }

    constructor(props) {
        super(props);

        this.stateTree = new Baobab({
            "activeTab": null,
            "chat": {
            },
            "messageList": [],
            "pendingMessage": "",
            "userList": []
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
    }

    onChatColorChange(color) {
        console.log(color);
    }

    onChatIconChange(icon) {
        console.log(icon);
    }

    onChatTitleChange(title) {
        console.log(title);
    }

    onFormSubmit(evt) {
        evt.preventDefault();

        this.stateTree.set("pendingMessage", "");
        this.stateTree.commit();

        this.onMessageSubmit(React.findDOMNode(this.refs.messageTextInput).value);
    }

    onMessageSubmit(message) {
        this.socket.emit(EVENTS.CHTB_CLIENT_MESSAGE, {
            "chat": this.stateTree.get("chat"),
            "message": {
                "content": message
            }
        });
    }

    onPendingMessageChange(evt) {
        evt.preventDefault();

        this.stateTree.set("pendingMessage", evt.target.value);
        this.stateTree.commit();
    }

    onToggleActiveTabClick() {
        return onToggleActiveTabClick.apply(this, arguments);
    }

    render() {
        var messageAndUserList = this.stateTree.facets.messageAndUserList.get(),
            state = this.stateTree.get();

        return <MainDocument {...this.props} className="page-chat">
            <header className={state.chat.themeClassnames}>
                <nav>
                    <Link to="/">
                        <span className="fa fa-arrow-left arrow" />
                        Boards
                    </Link>
                    <span className={classnames([
                        "icon",
                        state.chat.iconClassnames
                    ])} />
                    <strong>{state.chat.title}</strong>
                </nav>
                <div className="subbar">
                    <div className="subbar-inwrap">
                        <a className="button-xs sub-button" onClick={evt => this.onToggleActiveTabClick(evt, "userList")}>guest list</a>
                        <a className="button-xs sub-button" onClick={evt => this.onToggleActiveTabClick(evt, "changeTitle")}>title</a>
                        <a className="button-xs sub-button" onClick={evt => this.onToggleActiveTabClick(evt, "changeIcon")}>icon</a>
                        <a className="button-xs sub-button" onClick={evt => this.onToggleActiveTabClick(evt, "changeColor")}>color</a>
                        <a className="button-xs sub-button" onClick={evt => this.onToggleActiveTabClick(evt, "privPublic")}>private</a>

                        {(() => {
                            switch (state.activeTab) {
                                case "changeColor":
                                    return <ColorSettings
                                        chat={state.chat}
                                        onChatColorChange={newChatColor => this.onChatColorChange(newChatColor)}
                                    ></ColorSettings>;
                                case "changeIcon":
                                    return <IconSettings
                                        chat={state.chat}
                                        onChatIconChange={newChatIcon => this.onChatIconChange(newChatIcon)}
                                    ></IconSettings>;
                                case "changeTitle":
                                    return <TitleSettings
                                        chat={state.chat}
                                        onChatTitleChange={newChatTitle => this.onChatTitleChange(newChatTitle)}
                                    ></TitleSettings>;
                                case "privPublic":
                                    return <PrivacySettings />;
                                case "userList":
                                    return <UserList />;
                            }
                        })()}
                    </div>
                </div>
            </header>

            <section className="messageList">
                {messageAndUserList.map(messageAndUser => <article className={"type-" + messageAndUser.message.type} key={messageAndUser.message._id}>
                    {/* messageAndUser.user && messageAndUser.user.displayName}, {moment(messageAndUser.message.date).format("YYYY-MM-DD HH:mm:ss") */}
                    {messageAndUser.message.content}
                </article>)}
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
}

ChatDocument.propTypes = {
    "params": React.PropTypes.shape({
        "chatId": React.PropTypes.string.isRequired
    }).isRequired
};

// function onChatColorChange(newChatColor) {
//     socket.emit(EVENTS.CHTB_CLIENT_CHAT_COLOR_CHANGE, {
//         "chat": chatDocumentConfig.chat,
//         "newChatColor": newChatColor
//     });
// }

// function onChatIconChange(newChatIcon) {
//     socket.emit(EVENTS.CHTB_CLIENT_CHAT_ICON_CHANGE, {
//         "chat": chatDocumentConfig.chat,
//         "newChatIcon": newChatIcon
//     });
// }

// function onChatTitleChange(newChatTitle) {
//     socket.emit(EVENTS.CHTB_CLIENT_CHAT_TITLE_CHANGE, {
//         "chat": chatDocumentConfig.chat,
//         "newChatTitle": newChatTitle
//     });
// }
