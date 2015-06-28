/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import BrowserHistory from "react-router/lib/BrowserHistory";
import ChatColorSettings from "chatboard/React/ChatColorSettings";
import ChatDocument from "chatboard/React/ChatDocument";
import ChatGuestList from "chatboard/React/ChatGuestList";
import ChatListDocument from "chatboard/React/ChatListDocument";
import CreateBoardDocument from "chatboard/React/CreateBoardDocument";
import LoginDocument from "chatboard/React/LoginDocument";
import MainDocument from "chatboard/React/MainDocument";
import React from "react";
import {Route, Router} from "react-router";

React.render(<Router history={new BrowserHistory()}>
    <Route component={MainDocument}>
        <Route path="/" component={ChatListDocument} />
        <Route path="/create" component={CreateBoardDocument} />
        <Route path="/login" component={LoginDocument} />
        <Route path="/:chatId" component={ChatDocument}>
            <Route path="/color" component={ChatColorSettings} />
            <Route path="/guests" component={ChatGuestList} />
        </Route>
    </Route>
</Router>, document.body);
