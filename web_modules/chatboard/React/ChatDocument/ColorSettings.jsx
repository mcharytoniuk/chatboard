/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import CHAT_THEMES from "chatboard-enums/CHAT_THEMES";
import ChatPropType from "chatboard/React/PropType/Chat";
import classnames from "classnames";
import React from "react";

export default class ColorSettings extends React.Component {
    onChatColorClick(evt, newChatColor) {
        evt.preventDefault();

        this.props.onChatColorChange(newChatColor);
    }

    render() {
        return <div className="active gui-slidePanel panel-changeColor">
            <div className="panelHeader">chat color</div>
            <div className="panelContent">
                <div className="colorPalette">
                    {CHAT_THEMES.map(theme => <div
                        className={classnames({
                            "active": this.props.chat.themeClassnames === theme.themeClassnames,
                            [theme.themeClassnames]: true
                        })}
                        key={theme.themeClassnames}
                        onClick={evt => this.onChatColorClick(evt, theme)}
                    >{theme.title}</div>)}
                </div>
            </div>
        </div>;
    }
}

ColorSettings.propTypes = {
    "chat": ChatPropType.isRequired,
    "onChatColorChange": React.PropTypes.func.isRequired
};
