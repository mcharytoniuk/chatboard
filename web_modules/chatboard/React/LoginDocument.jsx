/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

/*eslint no-underscore-dangle: 0 */

import MainDocument from "chatboard/React/MainDocument";
import React from "react";
import {Link} from "react-router";

export default React.createClass({
    "render": function () {
        return <MainDocument {...this.props} className="page-login">
            <h1>
                Log in using any of the following services:
            </h1>
            <Link to="/">
                <span className="fa fa-user" />
                Continue without logging in
            </Link>
            <a className="facebook" href="/auth/login/facebook">
                <span className="fa fa-facebook-official" />
                Log in using Facebook
            </a>
        </MainDocument>;
    }
});
