/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

/*eslint no-underscore-dangle: 0 */

import ChatPropType from "chatboard/React/PropType/Chat";
import classnames from "classnames";
import React from "react";
import UserPropType from "chatboard/React/PropType/User";

export default class MainDocument extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "activeTab": null
        };
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
            <div className="wrapper">
                <nav className="topbar">
                    <ul className="topnav">
                        <li><a href="#"><span className="ion-coffee logo" /></a></li>
                        <li><a href="#">Create Board</a></li>
                        <li><a href="#">Terms of use</a></li>
                        {(() => {
                            if (this.props.user) {
                                return <li>
                                    <a href="#" onClick={evt => this.onToggleActiveTabClick(evt, "myProfile")}>
                                        <span className="ion-person" /> My profile
                                    </a>
                                </li>;
                            }
                        }())}
                        {(() => {
                            if (this.props.user) {
                                return <li>
                                    <a href="/auth/logout">
                                        <span className="fa fa-sign-out" /> Logout
                                        ({this.props.user.displayName})
                                    </a>
                                </li>;
                            }

                            return <li>
                                <a href="/login.html">
                                    <span className="fa fa-sign-in" /> Login
                                </a>
                            </li>;
                        })()}
                        <li className="search-container">
                            <input type="text" placeholder="Search" className="search" />
                            <span className="ion-ios-search-strong icon" />
                        </li>
                    </ul>
                </nav>
                <div className="subbar">
                    <div className="subbar-inwrap">
                        <span className="button-xs circular fblike">like us on facebook</span>
                        {(() => {
                            if (this.props.user && "myProfile" === this.state.activeTab) {
                                return <form className="active gui-slidePanel panel-myProfile">
                                    <div className="panelHeader">my profile</div>
                                    <div className="panelContent">
                                        <label>
                                            Edit:
                                            <input type="text" className="input-md" defaultValue={this.props.user.displayName} />
                                        </label>
                                        <div className="bar">
                                            <div className="bar-left">
                                                <img src="http://woape.com/avatar_placeholder.png" alt="user photo" className="userPhoto" />
                                                <span className="button-sm getPhotoBtn">import photo from facebook</span>
                                            </div>
                                            <div className="bar-right"><a href="#" className="deleteAccountBtn">delete account</a></div>
                                        </div>
                                    </div>
                                </form>;
                            }
                        }())}
                    </div>
                </div>
                <div className="container">
                    <section className="tileGrid">
                        {this.props.chatList.map(chat => <a className={classnames("tile", chat.themeClassnames)} href={chat._id} key={chat._id}>
                            <div>
                                <span className="upper-left tile-part">
                                    <span className="ion-chatbubble icon" />
                                    <span>{chat.messageListLength}</span>
                                </span>
                                <span className="upper-right tile-part">
                                    <span className="ion-person-stalker icon" />
                                    <span>{chat.memberListLength}</span>
                                </span>
                                <span className="centered tile-part">
                                    <span className={classnames("icon", chat.iconClassnames)} />
                                    <strong>{chat.title}</strong>
                                </span>
                            </div>
                        </a>)}
                    </section>
                </div>
            </div>

            <div className="footer">
                <p>
                    &copy; 2015-present.
                    Made with love <span className="fa fa-heart-o" /><br />
                    by Authors of <i>Chatboard</i>
                </p>
            </div>
        </div>;
    }
}

MainDocument.propTypes = {
    "chatList": React.PropTypes.arrayOf(ChatPropType).isRequired,
    "onUserDisplayNameChange": React.PropTypes.func.isRequired,
    "user": UserPropType
};
