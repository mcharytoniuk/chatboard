/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import React from "react";

export default class PrivacySettings extends React.Component {
    render() {
        return <div className="active gui-slidePanel panel-privPublic">
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
        </div>;
    }
}
