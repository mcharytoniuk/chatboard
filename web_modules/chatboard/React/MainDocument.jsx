/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

/*eslint no-underscore-dangle: 0 */

import React from "react";
import {Link, Navigation} from "react-router";

import "whatwg-fetch";

export default React.createClass({
    "getInitialState": function () {
        return {
            "activeTab": null,
            "isBoardLoading": false
        };
    },
    "mixins": [
        Navigation
    ],
    "onCreateBoardClick": function (evt) {
        evt.preventDefault();

        this.setState({
            "isBoardLoading": true
        });

        fetch(window.location.origin + "/api/v1/chat", {
            "method": "post"
        }).then(function (response) {
            return response.json();
        }).then(response => {
            this.transitionTo(response.result._id);
            this.setState({
                "isBoardLoading": false
            });
        });
    },
    "propTypes": {
        "children": React.PropTypes.any.isRequired
    },
    "render": function () {
        return <section id="page">
            <aside>
                <nav>
                    <Link to="/">
                        chati
                    </Link>
                    <Link to="/create">
                        create private board
                    </Link>
                    <Link to="/login">
                        log in
                    </Link>
                </nav>

                <footer>
                    &copy; 2015-present.
                    Made with love <span className="fa fa-heart-o" /><br />
                    by authors of chati
                </footer>
            </aside>

            {React.Children.only(this.props.children)}
        </section>;
    }
});
