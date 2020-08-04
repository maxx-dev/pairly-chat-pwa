import React, { Component } from 'react';
import ChatCard from './ChatCard'
import SVGIcons from '../SVGIcons'
import SettingsSlideIn from "./slideIns/SettingsSlideIn";
import ChatList from "../views/ChatList";
import SearchBar from "./SearchBar";
import NewChatSlideIn from "./slideIns/NewChatSlideIn";
import ChooseChatsSlideIn from "./slideIns/ChooseChatsSlideIn";

export default class SideBar extends Component {

    constructor(props){

        //console.log('props.user in sidebar',props.user);
        super();
        this.state = {
            fullScreen: false,
            chooseChatsActive:false,
            // activeChatCard:false
        }
    }

    componentDidMount()
    {
        if ( navigator.getBattery)
        {
            navigator.getBattery().then((battery) => {
                //console.log('battery',battery)
                if (battery.level  <= 0.1) this.setState({batteryCritical:true})
            })
        }
    }

    toggleFunc () {
        this.setState((prevState) => {
            this.props.toggleFullScreen();
            return {
                fullScreen: !prevState.fullScreen
            }
        })
    }

    canShowPlaceHolder ()
    {
        return !this.state.searchFocused && !this.state.search;
    }

    onMenuBtnClick (type)
    {
        if (type === 'MENU')
        {
            this.setState({menuActive:!this.state.menuActive});
        }
        if (type === 'NEW_CHAT')
        {
            this.props.changeSlideInView('NewChatSlideIn');
        }
        if (type === 'CHOOSE_CHATS')
        {
            this.props.changeSlideInView('ChooseChatsSlideIn');
        }
    }

    onMenuAction (type)
    {
        console.log('onMenuAction',type);
        if (type === 'SIGN_OUT')
        {
            this.onSignOut();
        }
        if (type === 'SETTINGS')
        {
            this.props.changeSlideInView('SettingsSlideIn');
            //this.setState({showSettings:true,menuActive:false})
            this.setState({menuActive:false})
        }
    }

    onSignOut ()
    {
        console.log('onSignOut');
        localStorage.removeItem('token');
        window.location.reload();
    }

    onCloseSlideIn (trigger)
    {
        trigger();
    }

    onSearch (search)
    {
        if (search.indexOf('<br>') !== -1) search = search.replace('<br>','');
        this.setState({search:search});
    }

    onOpenProfile ()
    {
        if (this.props.onOpenProfile) this.props.onOpenProfile();
    }

    renderBatteryStatus ()
    {
        return !this.state.hideBatteryInfo && this.state.batteryCritical ? <div className="batteryStatus">
            <span>Device battery level is low!</span>
            <SVGIcons onClick={this.hideBatteryInfo.bind(this)} type="CLOSE_CIRCLE"/>
        </div> : false
    }

    hideBatteryInfo ()
    {
        this.setState({hideBatteryInfo:true})
    }

    render(){
        const { user } = this.props;
        //console.log('user',user);

        //console.log('slideInView',this.props.slideInView ? this.props.slideInView.type.name : false);
        return (
            <div className={this.props.toggle ? 'sidebar' : 'sidebar hide'}>

                {this.props.slideInView}
                <header data-noselect="1" className="sideBarHeader">

                    <div onClick={this.onOpenProfile.bind(this)} className="user">
                    <div className="profileImg">
                        <img src={user.img}/>
                    </div>
                    <div className="name textCont half"><span className="">{user.firstName}</span> <span className="">{user.lastName}</span></div>
                    </div>

                    <div className="menuBar">

                        <div className="wrapper">
                            <div onClick={this.onMenuBtnClick.bind(this,'NEW_CHAT')} className={['btn',this.props.slideInView && this.props.slideInView.type.name === 'NewChatSlideIn' ? 'active' : ''].join(' ')}><SVGIcons type="NEW_CHAT"/></div>
                            {/*<div onClick={this.onMenuBtnClick.bind(this,'CHOOSE_CHATS')} className={['btn',this.props.slideInView && this.props.slideInView.type.name === 'ChooseChatsSlideIn' ? 'active' : ''].join(' ')}><SVGIcons type="MENU"/></div>*/}
                            <div onClick={this.onMenuBtnClick.bind(this,'MENU')} className={['btn',this.state.menuActive ? 'active' : ''].join(' ')}><SVGIcons type="MENU"/></div>
                            {this.state.menuActive ? <div data-noselect="1" className="menu">
                                <ul className="">
                                    <li tabIndex="-1" className="" >
                                        <div onClick={this.onMenuAction.bind(this,'SIGN_OUT')} className="" role="button" title="Sign out">Sign out</div>
                                    </li>
                                    <li tabIndex="-1" className="" >
                                        <div onClick={this.onMenuAction.bind(this,'SETTINGS')} className="" role="button" title="Settings">Settings</div>
                                    </li>
                                </ul>

                            </div> : false}
                        </div>

                    </div>
                </header>
                {this.renderBatteryStatus()}
                <SearchBar onSearch={this.onSearch.bind(this)}></SearchBar>
                {<ChatList search={this.state.search} onActiveChatChanged={this.props.onActiveChatChanged.bind(this)} user={this.props.user}/>}
            </div>
        );
    };
}
