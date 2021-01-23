import React, { Component } from 'react';
import SVGIcons from "../../SVGIcons";
import SlideIn from "./SlideIn";
import SettingsContent from "../content/SettingsContent";

export default class SettingsSlideIn extends SlideIn {

    constructor(props){
        super();
        this.state = {
            depth:1,
            key:'ROOT',
            steps:[]
        };

        this.root = React.createRef();
    }

    goBack ()
    {
        let { depth } = this.state;
        depth--;
        //console.log('depth',depth);

        if (depth === 0)
        {
            super.goBack();
        }
        else
        {
            this.setState({depth})
        }
    }

    render() {
        const { depth, steps } = this.state;
        //console.log('this.props.deferredInstallPrompt ',window.app.deferredInstallPrompt)
        return (
            <div ref={this.root} className="settings slideIn">
                <div data-depth="1" className="depthWrapper">
                    {this.renderHeader('Settings')}
                    {<SettingsContent changeSlideInView={this.props.changeSlideInView.bind(this)} changeToast={this.props.changeToast.bind(this)}></SettingsContent>}
                </div>
                {steps}
            </div>
        );
    };
}
