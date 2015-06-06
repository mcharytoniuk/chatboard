/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import ChatPropType from "chatboard/React/PropType/Chat";
import React from "react";

export default class TitleSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "title": this.props.chat.title
        };
    }

    onChatTitleChange(evt) {
        evt.preventDefault();

        this.setState({
            "title": evt.target.value
        });
    }

    onFormSubmit(evt) {
        evt.preventDefault();

        this.props.onChatTitleChange(this.state.title);
    }

    render() {
        return <form className="active gui-slidePanel panel-changeTitle" onSubmit={evt => this.onFormSubmit(evt)}>
            <div className="panelHeader">chat title</div>
            <div className="panelContent">
                <label>
                    Edit:
                </label>
                <input
                    className="input-md"
                    onChange={evt => this.onChatTitleChange(evt)}
                    type="text"
                    value={this.state.title}
                ></input>
            </div>
        </form>;
    }
}

TitleSettings.propTypes = {
    "chat": ChatPropType.isRequired,
    "onChatTitleChange": React.PropTypes.func.isRequired
};
