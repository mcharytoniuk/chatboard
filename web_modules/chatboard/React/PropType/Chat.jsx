/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import React from "react";

export default React.PropTypes.shape({
    "_id": React.PropTypes.string.isRequired,
    "iconClassnames": React.PropTypes.string.isRequired,
    "themeClassnames": React.PropTypes.string.isRequired,
    "title": React.PropTypes.string.isRequired
});
