/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

/*eslint no-underscore-dangle: 0 */

import classnames from "classnames";
import EVENTS from "chatboard-enums/EVENTS";
import io from "socket.io-client";
import MainDocument from "chatboard/React/MainDocument";
import NAMESPACES from "chatboard-enums/NAMESPACES";
import React from "react";
import {Link} from "react-router";

export default class ChatListDocument extends React.Component {
    componentWillMount() {
        this.socket = io.connect(window.location.origin + NAMESPACES.INDEX);
    }

    componentDidMount() {
        this.socket.on(EVENTS.CHTB_SERVER_CHAT_LIST_UPDATE, chatList => {
            this.setState({
                "chatList": chatList
            });
        });
        this.socket.emit(EVENTS.CHTB_CLIENT_CHAT_LIST_UPDATE_REQUEST);
    }

    constructor(props) {
        super(props);

        this.state = {
            "chatList": []
        };
    }

    render() {
        return <MainDocument {...this.props} className="page-main">
            <form>
                <input autoFocus type="search" />
                <button type="submit">
                    <span className="fa fa-search" />
                </button>
            </form>
            <section>
                {this.state.chatList.map(chat => <Link className={classnames("tile", chat.themeClassnames)} key={chat._id} to={chat._id}>
                    <div className="status">
                        <span>
                            <span className="fa fa-comment" />
                            <span>{chat.messageListLength}</span>
                        </span>
                        <span>
                            <span className="fa fa-users" />
                            <span>{chat.memberListLength}</span>
                        </span>
                    </div>
                    <div className="content">
                        <div>
                            <div className={chat.iconClassnames} />
                            <div className="title">{chat.title}</div>
                        </div>
                    </div>
                </Link>)}
            </section>
        </MainDocument>;
    }
}
