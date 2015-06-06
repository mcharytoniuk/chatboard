/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import React from "react";

export default class TitleSettings extends React.Component {
    render() {
        return <div className="active gui-slidePanel panel-changeTitle">
            <div className="panelHeader">chat title</div>
            <div className="panelContent">
                <label>
                    Edit:
                </label>
                <input type="text" className="input-md" defaultValue="What to eat!???" />
            </div>
        </div>;
    }
}
