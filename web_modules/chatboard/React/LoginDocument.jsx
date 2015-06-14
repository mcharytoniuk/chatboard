/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

/*eslint no-underscore-dangle: 0 */

import React from "react";
import {Link} from "react-router";

export default class LoginDocument extends React.Component {
    componentWillMount() {
        document.body.className = "page-login";
    }

    render() {
        return <div className="login-window window-md box-lg z-shadow-5 hvr-wobble-vertical">
            <h1 className="grand text-xxl">
                mychat.chat
                {/* <span className="ion-chatbox-working" /> */}
                <span className="ion-chatbubbles" />
                {/* <span className="ion-chatboxes" /> */}
            </h1>
            <h2 className="text-md">
                Anonymous conversation boards in seconds
            </h2>
            <hr />
            <p>
                Duis feugiat fermentum lacus, consectetur finibus quam ornare eget.
                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
                posuere cubilia Curae;
                Phasellus porttitor ligula id nisi posuere sagittis.
            </p>
            <Link className="button-md circular hover-grow" to="/">
                skip
            </Link>
            <a className="button-md circular loginButton hover-grow" href="/auth/login/facebook">
                <span className="ion-social-facebook icon" />
                Log in with Facebook
            </a>
        </div>;
    }
}
