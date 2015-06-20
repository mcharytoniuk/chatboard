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
        "children": React.PropTypes.any.isRequired,
        "className": React.PropTypes.string.isRequired
    },
    "render": function () {
        return <div className={this.props.className} id="page">
            <aside>
                <nav>
                    <a href="#" onClick={evt => this.onCreateBoardClick(evt)}>
                        {this.state.isBoardLoading ? (
                            <span className="fa fa-spinner fa-pulse" />
                        ) : (
                            <span className="fa fa-plus" />
                        )}
                        create private board
                    </a>
                </nav>

                <footer>
                    &copy; 2015-present.
                    Made with love <span className="fa fa-heart-o" /><br />
                    by authors of mychat.chat
                </footer>
            </aside>

            <main>
                {this.props.children}
            </main>
        </div>;
    }
});
