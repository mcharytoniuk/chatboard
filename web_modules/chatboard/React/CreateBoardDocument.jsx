/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

/*eslint no-underscore-dangle: 0 */

import React from "react";
import {Navigation} from "react-router";

import "whatwg-fetch";

export default React.createClass({
    "componentDidMount": function () {
        fetch(window.location.origin + "/api/v1/chat", {
            "method": "post"
        }).then(function (response) {
            return response.json();
        }).then(response => {
            this.replaceWith(response.result._id);
        });
    },
    "mixins": [
        Navigation
    ],
    "render": function () {
        return <main className="preloader">
            <span className="fa fa-spinner fa-pulse" />
        </main>;
    }
});
