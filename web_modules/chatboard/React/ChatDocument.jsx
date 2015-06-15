/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

/*eslint no-underscore-dangle: 0 */

// import ChatPropType from "chatboard/React/PropType/Chat";
import classnames from "classnames";
import ColorSettings from "chatboard/React/ChatDocument/ColorSettings";
import IconSettings from "chatboard/React/ChatDocument/IconSettings";
import MainDocument from "chatboard/React/MainDocument";
// import MessagePropType from "chatboard/React/PropType/Message";
import moment from "moment";
import onToggleActiveTabClick from "chatboard/React/onToggleActiveTabClick";
import PrivacySettings from "chatboard/React/ChatDocument/PrivacySettings";
import React from "react";
import TitleSettings from "chatboard/React/ChatDocument/TitleSettings";
import UserList from "chatboard/React/ChatDocument/UserList";
// import UserPropType from "chatboard/React/PropType/User";
import {Link} from "react-router";

export default class ChatDocument extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "activeTab": null,
            "chat": {
            },
            "messageAndUserList": [],
            "pendingMessage": ""
        };
    }

    onFormSubmit(evt) {
        evt.preventDefault();

        this.setState({
            "pendingMessage": ""
        });

        this.props.onMessageSubmit(React.findDOMNode(this.refs.messageTextInput).value);
    }

    onPendingMessageChange(evt) {
        evt.preventDefault();

        this.setState({
            "pendingMessage": evt.target.value
        });
    }

    onToggleActiveTabClick() {
        return onToggleActiveTabClick.apply(this, arguments);
    }

    render() {
        return <MainDocument {...this.props} className="page-chat">
            <header className="boardHeader">
                <nav className={classnames([
                    "topbar",
                    this.state.chat.themeClassnames
                ])}>
                    <ul className="topnav">
                        <li>
                            <Link to="/">
                                <span className="fa fa-arrow-left arrow" />
                                Boards
                            </Link>
                        </li>
                        <li>
                            <span className={classnames([
                                "icon",
                                this.state.chat.iconClassnames
                            ])} />
                            <strong>{this.state.chat.title}</strong>
                        </li>
                        <li className="link-container">
                            <input type="text" defaultValue="http://chtbrd.com/he74n" className="link" />
                            <span className="fa fa-share-alt icon" />
                        </li>
                    </ul>
                </nav>
                <div className="subbar">
                    <div className="subbar-inwrap">
                        <a className="button-xs sub-button" onClick={evt => this.onToggleActiveTabClick(evt, "userList")}>guest list</a>
                        <a className="button-xs sub-button" onClick={evt => this.onToggleActiveTabClick(evt, "changeTitle")}>title</a>
                        <a className="button-xs sub-button" onClick={evt => this.onToggleActiveTabClick(evt, "changeIcon")}>icon</a>
                        <a className="button-xs sub-button" onClick={evt => this.onToggleActiveTabClick(evt, "changeColor")}>color</a>
                        <a className="button-xs sub-button" onClick={evt => this.onToggleActiveTabClick(evt, "privPublic")}>private</a>

                        {(() => {
                            switch (this.state.activeTab) {
                                case "changeColor":
                                    return <ColorSettings
                                        chat={this.state.chat}
                                        onChatColorChange={newChatColor => this.props.onChatColorChange(newChatColor)}
                                    ></ColorSettings>;
                                case "changeIcon":
                                    return <IconSettings
                                        chat={this.state.chat}
                                        onChatIconChange={newChatIcon => this.props.onChatIconChange(newChatIcon)}
                                    ></IconSettings>;
                                case "changeTitle":
                                    return <TitleSettings
                                        chat={this.state.chat}
                                        onChatTitleChange={newChatTitle => this.props.onChatTitleChange(newChatTitle)}
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

            <section className="boardMessages">
                <div className="cell">
                    <div className="content">
                        {this.state.messageAndUserList.map(messageAndUser => <article className={"type-" + messageAndUser.message.type} key={messageAndUser.message._id}>
                            <p className="article-header">
                                {messageAndUser.user && messageAndUser.user.displayName}, {moment(messageAndUser.message.date).format("YYYY-MM-DD HH:mm:ss")}
                            </p>
                            <a href="#">
                                <img src="http://woape.com/avatar_placeholder.png" alt="user photo" className="userPhoto" />
                            </a>
                            <div className="article-content">
                                <p>
                                    {messageAndUser.message.content}
                                </p>
                            </div>
                        </article>)}
                    </div>
                </div>
            </section>

            <footer className="boardFooter">
                <form className="inner-wrap" onSubmit={evt => this.onFormSubmit(evt)}>
                    <div className="right-side">
                        <button>Send</button>
                    </div>
                    <div className="left-side">
                        <input
                            autoFocus
                            onChange={evt => this.onPendingMessageChange(evt)}
                            placeholder="Message..."
                            ref="messageTextInput"
                            type="text"
                            value={this.state.pendingMessage}
                        ></input>
                    </div>
                </form>
            </footer>
        </MainDocument>;
    }
}

ChatDocument.propTypes = {
    // "chat": ChatPropType.isRequired,
    // "messageAndUserList": React.PropTypes.arrayOf(React.PropTypes.shape({
    //     "message": MessagePropType.isRequired,
    //     "user": UserPropType.isRequired
    // })).isRequired,
    "onChatColorChange": React.PropTypes.func.isRequired,
    "onChatIconChange": React.PropTypes.func.isRequired,
    "onChatTitleChange": React.PropTypes.func.isRequired,
    "onMessageSubmit": React.PropTypes.func.isRequired
};
