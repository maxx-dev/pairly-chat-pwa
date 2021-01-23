import React, { Component } from 'react';

export default class Spinner extends Component {

    render() {
        return <svg className="spinnerContainer" width="50" height="50" viewBox="0 0 44 44">
            <circle className="spinnerPath" cx="22" cy="22" r="20" fill="none" strokeWidth="4"></circle>
        </svg>;
    };
}
