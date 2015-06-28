/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import React from "react";

export default React.createClass({
    "render": function () {
        return <main className="preloader">
            <span className="fa fa-spinner fa-pulse" />
        </main>;
    }
});
