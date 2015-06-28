/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import React from "react";
import {Link, State} from "react-router";

export default React.createClass({
    "mixins": [
        State
    ],
    "propTypes": {
        "to": React.PropTypes.string.isRequired,
        "toggle": React.PropTypes.string.isRequired
    },
    "render": function () {
        var href;

        if (this.isActive(this.props.to)) {
            href = this.props.toggle;
        } else {
            href = this.props.to;
        }

        return <Link to={href}>
            {this.props.children}
        </Link>;
    }
});
