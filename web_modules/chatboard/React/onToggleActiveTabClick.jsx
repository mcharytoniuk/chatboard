/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

export default function onToggleActiveTabClick(evt, tabName) {
    var newActiveTab;

    evt.preventDefault();

    if (this.stateTree.get("activeTab") === tabName) {
        newActiveTab = null;
    } else {
        newActiveTab = tabName;
    }

    this.stateTree.set("activeTab", newActiveTab);
    this.stateTree.commit();
}
