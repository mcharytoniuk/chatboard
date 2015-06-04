/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

/*eslint no-underscore-dangle: 0 */

import classnames from "classnames";
import React from "react";

export default class ChatDocument extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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
                        <span className="button-xs sub-button" for-panel=".panel-userList">guest list</span>
                        <span className="button-xs sub-button" for-panel=".panel-changeTitle">title</span>
                        <span className="button-xs sub-button" for-panel=".panel-changeIcon">icon</span>
                        <span className="button-xs sub-button" for-panel=".panel-changeColor">color</span>
                        <span className="button-xs sub-button" for-panel=".panel-privPublic">private</span>

                        <div className="gui-slidePanel panel-userList">
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

                        <div className="gui-slidePanel panel-changeTitle">
                            <div className="panelHeader">chat title</div>
                            <div className="panelContent">
                                <label>
                                    Edit:
                                </label>
                                <input type="text" className="input-md" defaultValue="What to eat!???" />
                            </div>
                        </div>

                        <div className="gui-slidePanel panel-changeIcon">
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

                        <div className="gui-slidePanel panel-changeColor">
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

                        <div className="gui-slidePanel panel-privPublic">
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
                                {message.author}, {message.date}
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
                            autofocus
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
