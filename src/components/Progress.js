import React, { Component } from 'react';

export default class Progress extends Component {

    componentDidMount()
    {
      //  window.appMetrics['FCP'].setEnd(false,false, true);
    }

    render() {
        return <div className="progressContainer">
            <progress dir="ltr" id="progressbar" value="0" max="4607208.75"></progress>
        </div>
    };
}
