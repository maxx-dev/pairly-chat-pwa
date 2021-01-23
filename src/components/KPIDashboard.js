import React, { Component } from 'react';
import {changeToast, changeUser, changeView} from "../actions";
import {connect} from "react-redux";
import authHelper from '../libs/authHelper.js';
import SocketManager from "../SocketManager";
import socketIOClient from "socket.io-client";

class KPIDashboard extends Component {
    constructor(){
        super();
        this.state = {

        };
        this.listeners = {};
        let socket = socketIOClient({query:'token='+localStorage.getItem('token')+'&version='+process.env.VERSION});
        window.app.socketManager = new SocketManager(socket);
        this.initSocketEvents();
    }

    componentDidMount() {}

    componentWillUnmount()
    {
        //window.socket.removeEventListener('get/auth/login');
    }

    initSocketEvents ()
    {
        window.app.socketManager.on('connect', this.onConnect.bind(this));
        window.app.socketManager.on('get:dashboard', this.onGetDashboard.bind(this));
    }

    onConnect (e)
    {
        //console.log('onConnect');
        this.setState({socketConnected:true});
        window.app.socketManager.emit("get:dashboard", {});
    }

    onGetDashboard (appMetrics)
    {
        console.log('onGetDashboard',appMetrics);
    }

    render() {

        //const { email } = this.state;
        return (
            <div className='kpiDashboard'>

                kpiDashboard
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state
});
const mapDispatchToProps = dispatch => ({
    changeToast: function (data)
    {
        return dispatch(changeToast(data));
    },
    changeUser: function (data)
    {
        return dispatch(changeUser(data));
    },
    changeView: function (view)
    {
        return dispatch(changeView(view));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(KPIDashboard);