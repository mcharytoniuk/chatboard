/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

/*eslint no-underscore-dangle: 0 */

import classnames from "classnames";
import React from "react";

export default class MainDocument extends React.Component {
    render() {
        return <div>
            <div className="wrapper">
                <nav className="topbar">
                    <ul className="topnav">
                        <li><a href="#"><span className="ion-coffee logo"></span></a></li>
                        <li><a href="#">Create Board</a></li>
                        <li><a href="#">Terms of use</a></li>
                        <li><a href="#" for-panel=".panel-myProfile"><span className="ion-person"></span> My profile</a></li>
                        <li><a href="#"><span className="fa fa-sign-out"></span> Logout</a></li>
                        <li className="search-container">
                            <input type="text" placeholder="Search" className="search" />
                            <span className="ion-ios-search-strong icon"></span>
                        </li>
                    </ul>
                </nav>
                <div className="subbar">
                    <div className="subbar-inwrap">
                        <span className="button-xs circular fblike">like us on facebook</span>
                        <div className="gui-slidePanel panel-myProfile">
                            <div className="panelHeader">my profile</div>
                            <div className="panelContent">
                                <label>
                                    Edit:
                                    <input type="text" className="input-md" defaultValue="Dariusz Sikorski" />
                                </label>
                                <div className="bar">
                                    <div className="bar-left">
                                        <img src="http://woape.com/avatar_placeholder.png" alt="user photo" className="userPhoto" />
                                        <span className="button-sm getPhotoBtn">import photo from facebook</span>
                                    </div>
                                    <div className="bar-right"><a href="#" className="deleteAccountBtn">delete account</a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <section className="tileGrid">
                        {this.props.chatList.map(chat => <a className={classnames("tile", chat.themeClassnames)} href={chat.slug + ".chat"} key={chat._id}>
                            <div>
                                <span className="upper-left tile-part">
                                    <span className="ion-chatbubble icon"></span>
                                    <span>{chat.messagesCount}</span>
                                </span>
                                <span className="upper-right tile-part">
                                    <span className="ion-person-stalker icon"></span>
                                    <span>{chat.membersCount}</span>
                                </span>
                                <span className="centered tile-part">
                                    <span className={classnames("icon", chat.iconClassnames)}></span>
                                    <strong>{chat.title}</strong>
                                </span>
                            </div>
                        </a>)}
                    </section>
                </div>
            </div>

            <div className="footer">
                <p>
                    &copy; 2014-2015.
                    Made with love <span className="fa fa-heart-o"></span><br />
                    by Authors of <i>Chatboard</i>
                </p>
            </div>
        </div>;
    }
}
