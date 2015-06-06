/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import CHAT_ICONS from "chatboard-enums/CHAT_ICONS";
import ChatPropType from "chatboard/React/PropType/Chat";
import classnames from "classnames";
import React from "react";

export default class IconSettings extends React.Component {
    onChatIconClick(evt, newChatIcon) {
        evt.preventDefault();

        this.props.onChatIconChange(newChatIcon);
    }

    render() {
        return <div className="active gui-slidePanel panel-changeIcon">
            <div className="panelHeader">chat icon</div>
            <div className="panelContent">
                <div className="iconList">
                    {CHAT_ICONS.map(iconClassnames => <span
                        className={classnames({
                            "active": this.props.chat.iconClassnames === iconClassnames,
                            [iconClassnames]: true
                        })}
                        key={iconClassnames}
                        onClick={evt => this.onChatIconClick(evt, iconClassnames)}
                    ></span>)}
                </div>
            </div>
        </div>;
    }
}

IconSettings.propTypes = {
    "chat": ChatPropType.isRequired,
    "onChatIconChange": React.PropTypes.func.isRequired
};
