/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

export default function onToggleActiveTabClick(evt, tabName) {
    var newActiveTab;

    evt.preventDefault();

    if (this.state.activeTab === tabName) {
        newActiveTab = null;
    } else {
        newActiveTab = tabName;
    }

    this.setState({
        "activeTab": newActiveTab
    });
}
