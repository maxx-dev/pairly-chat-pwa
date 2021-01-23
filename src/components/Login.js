import React, { Component } from 'react';
import SVGIcons from "../SVGIcons";
import {changeToast, changeUser, changeView} from "../actions";
import {connect} from "react-redux";
import Toast from "./Toast";
import authHelper from '../libs/authHelper.js';

let regex = {
    email:new RegExp(/\b[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}\b/)
}

class Login extends Component {
    constructor(){
        super();
        this.state = {
            toggle: false,
            email:localStorage.getItem('loginEmail'),
            password:''
        };
        this.listeners = {};
    }
    componentDidMount() {

        this.listeners.keyUp = this.onKeyUp.bind(this);
        document.body.addEventListener('keyup',this.listeners.keyUp,true);
        //window.app.socketManager.on("get:auth/login", this.onAuth.bind(this));
        //window.app.socketManager.on('put:auth/webAuthVerify',this.onPerformedWebAuthLogin.bind(this));
        //document.querySelector('#username').focus();
        window.appMetrics['TTI'].setEnd(false,false, true);
    }

    componentWillUnmount()
    {
        //window.socket.removeEventListener('get/auth/login');
        document.body.removeEventListener('keyup',this.listeners.keyUp,true)
    }

    onPerformedWebAuthLogin ({err,token,user,appInfos})
    {
        console.log('onPerformedWebAuthLogin',err,token,user);
        this.onAuthSuccess(token,user,appInfos);
    }

    onKeyUp (e)
    {
        //console.log('onKeyUp',e.key);
        if (e.key === 'Enter')
        {
            this.onLogin();
        }
    }

    onAuthSuccess (token,user,appInfos)
    {
        localStorage.setItem('token',token);
        localStorage.setItem('loginEmail',user.email);
        //this.setState({user:user,appInfos:appInfos});
        this.props.onAuthSuccess(user,appInfos);
    }

    onAuth ({err,user,appInfos})
    {
        console.log('Login:onAuth',err,'user',user,'appInfos',appInfos);
        if (err === 'SUCCESS')
        {
            this.onAuthSuccess(user.token,user,appInfos);
        }
        else if (err === 'WEBAUTH')
        {
            let publicKey = authHelper.preformatGetAssertReq(user.webAuthResInfo);
            navigator.credentials.get({ publicKey:publicKey }).then(async function (response)
            {
                let makeCredResponse = authHelper.publicKeyCredentialToJSON(response);
                makeCredResponse.webAuthResInfo = user.webAuthResInfo;
                console.log('user', user);
                console.log('makeCredResponse', makeCredResponse);
                let [err,data] = await window.app.fetchManager.put('api/auth/webAuthVerify',{data:{makeCredResponse:makeCredResponse,email:user.email,isLogin:true}});
                if (err) console.log('WebAuth Err',err);
                console.log('DATA',data);
                this.onPerformedWebAuthLogin({err:data.err,token: data.token,user:data.user,appInfos:data.appInfos});
                //window.app.socketManager.emit('put:auth/webAuthVerify',makeCredResponse,user.email, true)
            }.bind(this)).catch(function ()
            {
                this.props.changeToast(<Toast text={'Biometric Login failed'}></Toast>)
            }.bind(this))
        }
        else
        {
            this.props.changeToast(<Toast text={'Wrong Login'}></Toast>)
        }
    }

    onChangeEmail (e)
    {
        let isEmail = e.target.value.match(regex.email);
        if (isEmail)
        {
            this.setState({email:e.target.value})
        }
    }

    onChangePassword (e)
    {
        //console.log('onChangePassword',e);
        this.setState({password:e.target.value})
    }

    onPasswordKeyDown (e)
    {
        //console.log('onPasswordKeyDown',e.key);
        if (e.key === 'Enter')
        {
            this.onLogin();
        }
    }

    async onLogin ()
    {
        let { email, password } = this.state;
        if (email && password)
        {
            let [err,data] = await window.app.fetchManager.get('api/auth/login',{data:{email:email,password:password}});
            if (!err)
            {
                this.onAuth({err:data.err,user:data.user,appInfos:data.appCodeName});
            }
            else
            {
                console.log('Auth failed',err);
            }
            //window.app.socketManager.emit('get:auth/login',{email:email,password:password});
            if (this.props.onLogin) this.props.onLogin();
        }
        else
        {
            this.props.changeToast(<Toast text={'Please provide email and password'}></Toast>)
        }
    }

    async onLoginViaWebAuth ()
    {
        console.log('onLoginViaWebAuth',localStorage.getItem('biometricLoginToken'));
        //let publicKey = authHelper.preformatGetAssertReq(user.token);
        /*const options = {
            publicKey:{
                challenge:Uint8Array.from("XXXXXX", c => c.charCodeAt(0)),
                allowCredentials:[
                    {
                        type:'public-key',
                        id:'hQQ6wVITEZGIX2Ls4QZAgTaRLMA',
                        transports:['internal']
                    }
                ]
            }
        };
        navigator.credentials.get(options).then(function (response)
        {
            let makeCredResponse = authHelper.publicKeyCredentialToJSON(response);
            console.log('makeCredResponse', makeCredResponse);
            //window.app.socketManager.emit('put:auth/webAuthVerify',makeCredResponse,user.email)
        }.bind(this)).catch(function (e)
        {
            console.error(e);
            this.props.changeToast(<Toast text={'Biometric Login failed'}></Toast>)
        }.bind(this))*/
        let [err,data] = await window.app.fetchManager.get('api/auth/login',{data:{email:localStorage.getItem('loginEmail'),biometricLoginToken:localStorage.getItem('biometricLoginToken')}});
        if (!err)
        {
            this.onAuth({err:data.err,user:data.user,appInfos:data.appCodeName});
        }
        else
        {
            console.log('Auth failed',err);
        }
        //window.app.socketManager.emit('get:auth/login',{email:localStorage.getItem('loginEmail'),biometricLoginToken:localStorage.getItem('biometricLoginToken')});
        if (this.props.onLogin) this.props.onLogin();
    }

    onUserNameFocus ()
    {
        //console.log('onUserNameFocus');
        //window.appMetrics['TTI'].setEnd(false,true, true);
    }
    render() {

        const { email } = this.state;
        return (
            <div className='loginContainer'>
                {/*<img src={logo} alt='App Logo'/>*/}
                <SVGIcons type="LOGO"></SVGIcons>
                <h1>Pairly</h1>
                <div>
                    {/*<input id="username" autoFocus={true} onKeyPress={(e)=> {if(e.key === "Enter") submitUsername()}} name="userNameSelection" placeholder='Username' onChange={(e)=> universalChangeHandler(e)} value={username} />*/}
                    <label htmlFor="promo">Email</label>
                    {/* autoFocus={true} breaks keyboard in ios 14 */}
                    <input aria-label="email" id="username"  name="email" onFocus={this.onUserNameFocus.bind(this)} placeholder='Email' onChange={this.onChangeEmail.bind(this)} defaultValue={email} />
                    <label htmlFor="promo">Password</label>
                    <input aria-label="password" id="password" name="password" type="password" placeholder='Password' onKeyDown={this.onPasswordKeyDown.bind(this)} onChange={this.onChangePassword.bind(this)} defaultValue={''} />

                    <div className="def-btn" onClick={this.onLogin.bind(this)}>Sign In</div>
                    {localStorage.getItem('biometricLoginToken') ? <div className="def-btn" onClick={this.onLoginViaWebAuth.bind(this)}>Sign In with Face/Touch-ID</div> : false}
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);