/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import React from "react";

export default React.PropTypes.shape({
    "_id": React.PropTypes.string.isRequired,
    "displayName": React.PropTypes.string.isRequired,
    "gender": React.PropTypes.string.isRequired,
    "name": React.PropTypes.shape({
        "familyName": React.PropTypes.string.isRequired,
        "givenName": React.PropTypes.string.isRequired,
        "middleName": React.PropTypes.string
    }).isRequired,
    "username": React.PropTypes.string
});
