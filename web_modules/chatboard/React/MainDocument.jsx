/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

/*eslint no-underscore-dangle: 0 */

import onToggleActiveTabClick from "chatboard/React/onToggleActiveTabClick";
import React from "react";
import {Link} from "react-router";

import "whatwg-fetch";

export default class MainDocument extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "activeTab": null,
            "isBoardLoading": false
        };
    }

    onCreateBoardClick(evt) {
        evt.preventDefault();

        this.setState({
            "isBoardLoading": true
        });

        fetch(window.location.origin + "/api/v1/chat", {
            "method": "post"
        }).then(function (response) {
            return response.json();
        }).then(response => {
            this.context.router.transitionTo(response.result._id);
        });
    }

    onToggleActiveTabClick() {
        return onToggleActiveTabClick.apply(this, arguments);
    }

    render() {
        return <div className={this.props.className} id="page">
            <aside>
                <nav>
                    <Link to="/">
                        <span className="fa fa-coffee" />
                        board list
                    </Link>
                    <a href="#" onClick={evt => this.onCreateBoardClick(evt)}>
                        {this.state.isBoardLoading ? (
                            <span className="fa fa-spinner fa-pulse" />
                        ) : (
                            <span className="fa fa-plus" />
                        )}
                        create board
                    </a>
                    <a href="#">
                        <span className="fa fa-book" />
                        terms of use
                    </a>
                    {this.state.user && (
                        <a href="#" onClick={evt => this.onToggleActiveTabClick(evt, "myProfile")}>
                            <span className="fa fa-child" />
                            my profile
                        </a>
                    )}
                    {this.state.user ? (
                        <a href="/auth/logout">
                            <span className="fa fa-sign-out" />
                            log out
                        </a>
                    ) : (
                        <Link to="/login">
                            <span className="fa fa-sign-in" />
                            log in
                        </Link>
                    )}
                    <a href="#">
                        <span className="fa fa-search" />
                        search
                    </a>

                    {this.state.user && "myProfile" === this.state.activeTab && (
                        <form className="active gui-slidePanel panel-myProfile">
                            <div className="panelHeader">my profile</div>
                            <div className="panelContent">
                                <label>
                                    Edit:
                                    <input type="text" className="input-md" defaultValue={this.state.user.displayName} />
                                </label>
                                <div className="bar">
                                    <div className="bar-left">
                                        <img src="http://woape.com/avatar_placeholder.png" alt="user photo" className="userPhoto" />
                                        <span className="button-sm getPhotoBtn">import photo from facebook</span>
                                    </div>
                                    <div className="bar-right"><a href="#" className="deleteAccountBtn">delete account</a></div>
                                </div>
                            </div>
                        </form>
                    )}
                </nav>

                <footer>
                    &copy; 2015-present.
                    Made with love <span className="fa fa-heart-o" /><br />
                    by Authors of <i>Chatboard</i>
                </footer>
            </aside>

            <main>
                {this.props.children}
            </main>
        </div>;
    }
}

MainDocument.propTypes = {
    "children": React.PropTypes.any.isRequired,
    "className": React.PropTypes.string.isRequired
};
