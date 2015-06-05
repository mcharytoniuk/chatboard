/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import MainDocument from "chatboard/React/MainDocument";
import React from "react";

var mainDocumentConfig = JSON.parse(document.getElementById("MainDocumentConfig").textContent);

React.render(<MainDocument {...mainDocumentConfig} />, document.body);
