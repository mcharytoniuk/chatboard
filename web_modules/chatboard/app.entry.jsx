/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import BrowserHistory from "react-router/lib/BrowserHistory";
import LoginDocument from "chatboard/React/LoginDocument";
import MainDocument from "chatboard/React/MainDocument";
import React from "react";
import {Route, Router} from "react-router";

React.render(<Router history={BrowserHistory}>
    <Route path="/" component={MainDocument} />
    <Route path="/login" component={LoginDocument} />
</Router>, document.body);
