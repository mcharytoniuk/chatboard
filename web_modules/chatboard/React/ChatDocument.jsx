/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

/*eslint no-underscore-dangle: 0 */

import ChatPropType from "chatboard/React/PropType/Chat";
import ColorSettings from "chatboard/React/ChatDocument/ColorSettings";
import IconSettings from "chatboard/React/ChatDocument/IconSettings";
import PrivacySettings from "chatboard/React/ChatDocument/PrivacySettings";
import TitleSettings from "chatboard/React/ChatDocument/TitleSettings";
import classnames from "classnames";
import moment from "moment";
import React from "react";
import UserList from "chatboard/React/ChatDocument/UserList";

export default class ChatDocument extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "activeTab": null,
            "pendingMessage": ""
        };
    }

    closeTabs() {
        this.setState({
            "activeTab": null
        });
    }

    onChatIconChange(newChatIcon) {
        this.closeTabs();
        this.props.onChatIconChange(newChatIcon);
    }

    onChatTitleChange(newChatTitle) {
        this.closeTabs();
        this.props.onChatTitleChange(newChatTitle);
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

    onToggleActiveTabClick(evt, tabName) {
        var newActiveTab;

        evt.preventDefault();

        if (this.state.activeTab === tabName) {
            newActiveTab = null;
        } else {
            newActiveTab = tabName;
        }

        this.setState({
            "activeTab": newActiveTab
        });
    }

    render() {
        return <div>
            <header className="boardHeader">
                <nav className={classnames([
                    "topbar",
                    this.props.chat.themeClassnames
                ])}>
                    <ul className="topnav">
                        <li>
                            <a href="/">
                                <span className="ion-arrow-left-a arrow" />
                                Boards
                            </a>
                        </li>
                        <li>
                            <span className={classnames([
                                "icon",
                                this.props.chat.iconClassnames
                            ])} />
                            <strong>{this.props.chat.title}</strong>
                        </li>
                        <li className="link-container">
                            <input type="text" defaultValue="http://chtbrd.com/he74n" className="link" />
                            <span className="ion-link icon" />
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
                                    return <ColorSettings />;
                                case "changeIcon":
                                    return <IconSettings
                                        chat={this.props.chat}
                                        onChatIconChange={newChatIcon => this.onChatIconChange(newChatIcon)}
                                    ></IconSettings>;
                                case "changeTitle":
                                    return <TitleSettings
                                        chat={this.props.chat}
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

            <section className="boardMessages">
                <div className="cell">
                    <div className="content">
                        {this.props.messageList.map(message => <article className={"type-" + message.type} key={message._id}>
                            <p className="article-header">
                                {message.author}, {moment(message.date).format("YYYY-MM-DD HH:mm:ss")}
                            </p>
                            <a href="#">
                                <img src="http://woape.com/avatar_placeholder.png" alt="user photo" className="userPhoto" />
                            </a>
                            <div className="article-content">
                                <p>
                                    {message.content}
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
        </div>;
    }
}

ChatDocument.propTypes = {
    "chat": ChatPropType.isRequired,
    "messageList": React.PropTypes.array.isRequired,
    "onChatIconChange": React.PropTypes.func.isRequired,
    "onChatTitleChange": React.PropTypes.func.isRequired,
    "onMessageSubmit": React.PropTypes.func.isRequired
};
