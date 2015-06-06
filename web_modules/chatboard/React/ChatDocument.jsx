/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

/*eslint no-underscore-dangle: 0 */

import classnames from "classnames";
import moment from "moment";
import React from "react";

export default class ChatDocument extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "activeTab": null,
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

    onSetActiveTabClick(evt, tabName) {
        evt.preventDefault();

        this.setState({
            "activeTab": tabName
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
                        <a className="button-xs sub-button" onClick={evt => this.onSetActiveTabClick(evt, "userList")}>guest list</a>
                        <a className="button-xs sub-button" onClick={evt => this.onSetActiveTabClick(evt, "changeTitle")}>title</a>
                        <a className="button-xs sub-button" onClick={evt => this.onSetActiveTabClick(evt, "changeIcon")}>icon</a>
                        <a className="button-xs sub-button" onClick={evt => this.onSetActiveTabClick(evt, "changeColor")}>color</a>
                        <a className="button-xs sub-button" onClick={evt => this.onSetActiveTabClick(evt, "privPublic")}>private</a>

                        <div className={classnames({
                            "active": "userList" === this.state.activeTab,
                            "gui-slidePanel": true,
                            "panel-userList": true
                        })}>
                            <div className="panelHeader">Conversation guests</div>
                            <div className="panelContent">
                                <div className="vert-list">
                                    <div>
                                        <a href="#">
                                            <img src="http://woape.com/avatar_placeholder.png" alt="user photo" className="userPhoto" />
                                            <span className="userName">Dariusz Sikorski</span>
                                        </a>
                                        <span className="button-xs kickButton">kick</span>
                                    </div>
                                    <div>
                                        <a href="#">
                                            <img src="http://woape.com/avatar_placeholder.png" alt="user photo" className="userPhoto" />
                                            <span className="userName">Dariusz Sikorski</span>
                                        </a>
                                        <span className="button-xs kickButton">kick</span>
                                    </div>
                                    <div>
                                        <a href="#">
                                            <img src="http://woape.com/avatar_placeholder.png" alt="user photo" className="userPhoto" />
                                            <span className="userName">Dariusz Sikorski</span>
                                        </a>
                                        <span className="userStatus">(Admin)</span>
                                        <span className="button-xs kickButton">kick</span>
                                    </div>
                                    <div>
                                        <a href="#">
                                            <img src="http://woape.com/avatar_placeholder.png" alt="user photo" className="userPhoto" />
                                            <span className="userName">Dariusz Sikorski</span>
                                        </a>
                                        <span className="button-xs kickButton">kick</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={classnames({
                            "active": "changeTitle" === this.state.activeTab,
                            "gui-slidePanel": true,
                            "panel-changeTitle": true
                        })}>
                            <div className="panelHeader">chat title</div>
                            <div className="panelContent">
                                <label>
                                    Edit:
                                </label>
                                <input type="text" className="input-md" defaultValue="What to eat!???" />
                            </div>
                        </div>

                        <div className={classnames({
                            "active": "changeIcon" === this.state.activeTab,
                            "gui-slidePanel": true,
                            "panel-changeIcon": true
                        })}>
                            <div className="panelHeader">chat icon</div>
                            <div className="panelContent">
                                <div className="iconList">
                                    <span className="ion-android-happy" />
                                    <span className="fa fa-meh-o" />
                                    <span className="ion-android-sad" />
                                    <span className="fa fa-comments-o" />
                                    <span className="ion-beer" />
                                    <span className="ion-pizza" />
                                    <span className="ion-ios-sunny" />
                                    <span className="ion-headphone" />
                                    <span className="ion-heart" />
                                    <span className="ion-transgender" />
                                    <span className="fa fa-bicycle" />
                                    <span className="fa fa-facebook-official" />
                                    <span className="ion-map" />
                                    <span className="ion-camera active" />
                                    <span className="ion-iphone" />
                                    <span className="ion-xbox" />
                                    <span className="ion-playstation" />
                                    <span className="ion-model-s" />
                                    <span className="ion-code-working" />
                                    <span className="ion-ios-game-controller-b" />
                                    <span className="fa fa-stethoscope" />
                                </div>
                            </div>
                        </div>

                        <div className={classnames({
                            "active": "changeColor" === this.state.activeTab,
                            "gui-slidePanel": true,
                            "panel-changeColor": true
                        })}>
                            <div className="panelHeader">chat color</div>
                            <div className="panelContent">
                                <div className="colorPalette">
                                    <div className="theme-greenSea">color</div>
                                    <div className="theme-pinkStraw">color</div>
                                    <div className="theme-redAccent">color</div>
                                    <div className="theme-greenSun">color</div>
                                    <div className="theme-redShine">color</div>
                                    <div className="theme-eveningSand">color</div>
                                    <div className="theme-underWater">color</div>
                                    <div className="theme-deepPurple active">color</div>
                                    <div className="theme-skyBlue">color</div>
                                    <div className="theme-calmGray">color</div>
                                    <div className="theme-calmBlack">color</div>
                                    <div className="theme-deepBlue">color</div>
                                </div>
                            </div>
                        </div>

                        <div className={classnames({
                            "active": "privPublic" === this.state.activeTab,
                            "gui-slidePanel": true,
                            "panel-privPublic": true
                        })}>
                            <div className="panelHeader">
                                Set chat as private or public
                            </div>
                            <div className="panelContent">
                                <label>
                                    <input type="checkbox" />
                                    Set as private
                                </label>
                                <hr />
                                <i>
                                    Your chat wont appear on main page when set on private,
                                    but still can be viewed by people who got link to it.
                                </i>
                            </div>
                        </div>
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
    "chat": React.PropTypes.object.isRequired,
    "messageList": React.PropTypes.array.isRequired,
    "onMessageSubmit": React.PropTypes.func.isRequired
};
