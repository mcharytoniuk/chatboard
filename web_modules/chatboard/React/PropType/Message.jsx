/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import React from "react";

export default React.PropTypes.shape({
    "_id": React.PropTypes.string.isRequired,
    "content": React.PropTypes.string.isRequired,
    "date": React.PropTypes.number.isRequired,
    "type": React.PropTypes.string.isRequired
});
