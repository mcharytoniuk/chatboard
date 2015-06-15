/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import BrowserHistory from "react-router/lib/BrowserHistory";
import ChatListDocument from "chatboard/React/ChatListDocument";
import LoginDocument from "chatboard/React/LoginDocument";
import React from "react";
import {Route, Router} from "react-router";

React.render(<Router history={BrowserHistory}>
    <Route path="/" component={ChatListDocument} />
    <Route path="/login" component={LoginDocument} />
</Router>, document.body);
