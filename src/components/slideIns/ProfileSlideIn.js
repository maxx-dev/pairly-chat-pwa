import React, { Component } from 'react';
import SlideIn from "./SlideIn";
import ChatCard from "../ChatCard";
import SVGIcons from "../../SVGIcons";

export default class ProfileSlideIn extends SlideIn {

    constructor(props) {
        super();
        this.state = {
            key:'ROOT',
            steps:[],
        };
        this.root = React.createRef();
    }

    render() {
        const { chat, view } = this.props;
        if (!chat) return false;
        let user = chat.user;
        return (
            <div ref={this.root} className="profile slideIn">
                <div data-depth="1" className="depthWrapper">
                    <header data-noselect="1" className="chatHeader">

                        <div className="wrapper">

                            <div onClick={this.goBack.bind(this)} className="icon">
                                <SVGIcons type="CLOSE"/>
                            </div>
                            <div className="headline">Info</div>
                        </div>

                    </header>
                    <div className="content">

                        <div className="top">

                            <div className="img">
                                <img src={user.img}></img>
                            </div>
                        </div>
                        <div className="name">
                            {user.firstName} {user.lastName}
                        </div>

                    </div>
                    </div>

            </div>
        );
    };
}
