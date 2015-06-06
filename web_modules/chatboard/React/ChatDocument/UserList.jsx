/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import React from "react";

export default class UserList extends React.Component {
    render() {
        return <div className="active gui-slidePanel panel-userList">
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
        </div>;
    }
}
