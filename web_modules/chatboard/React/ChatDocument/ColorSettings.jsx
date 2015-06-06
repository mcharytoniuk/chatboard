/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import React from "react";

export default class ColorSettings extends React.Component {
    render() {
        return <div className="active gui-slidePanel panel-changeColor">
            <div className="panelHeader">chat color</div>
            <div className="panelContent">
                <div className="colorPalette">
                    <div className="theme-greenSea">color</div>
                    <div className="theme-pinkStraw">color</div>
                    <div className="theme-redAccent">color</div>
                    <div className="theme-greenSun">color</div>
                    <div className="theme-redShine">color</div>
                    <div className="theme-eveningSand">color</div>
                    <div className="theme-underWater">color</div>
                    <div className="theme-deepPurple active">color</div>
                    <div className="theme-skyBlue">color</div>
                    <div className="theme-calmGray">color</div>
                    <div className="theme-calmBlack">color</div>
                    <div className="theme-deepBlue">color</div>
                </div>
            </div>
        </div>;
    }
}
