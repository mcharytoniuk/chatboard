/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

/*eslint no-underscore-dangle: 0 */

import CHAT_THEMES from "chatboard-enums/CHAT_THEMES";
import React from "react";

export default React.createClass({
    "propTypes": {
    },
    "render": function () {
        return <nav className="chatSettings chatColorSettings">
            {CHAT_THEMES.map(chatTheme => <a className={chatTheme.themeClassnames} key={chatTheme.themeClassnames}>
                {chatTheme.title}
            </a>)}
        </nav>;
    }
});
