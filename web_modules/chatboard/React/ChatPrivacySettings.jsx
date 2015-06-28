/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import React from "react";

export default React.createClass({
    "propTypes": {
    },
    "render": function () {
        return <nav className="chatSettings chatColorSettings">
            <a>
                private
            </a>
            <a>
                public
            </a>
        </nav>;
    }
});
