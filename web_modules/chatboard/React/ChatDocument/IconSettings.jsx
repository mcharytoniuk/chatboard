/**
 * Copyright (c) 2015-present, chatboard
 * All rights reserved.
 */

"use strict";

import React from "react";

export default class IconSettings extends React.Component {
    render() {
        return <div className="active gui-slidePanel panel-changeIcon">
            <div className="panelHeader">chat icon</div>
            <div className="panelContent">
                <div className="iconList">
                    <span className="ion-android-happy" />
                    <span className="fa fa-meh-o" />
                    <span className="ion-android-sad" />
                    <span className="fa fa-comments-o" />
                    <span className="ion-beer" />
                    <span className="ion-pizza" />
                    <span className="ion-ios-sunny" />
                    <span className="ion-headphone" />
                    <span className="ion-heart" />
                    <span className="ion-transgender" />
                    <span className="fa fa-bicycle" />
                    <span className="fa fa-facebook-official" />
                    <span className="ion-map" />
                    <span className="ion-camera active" />
                    <span className="ion-iphone" />
                    <span className="ion-xbox" />
                    <span className="ion-playstation" />
                    <span className="ion-model-s" />
                    <span className="ion-code-working" />
                    <span className="ion-ios-game-controller-b" />
                    <span className="fa fa-stethoscope" />
                </div>
            </div>
        </div>;
    }
}
