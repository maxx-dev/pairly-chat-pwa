import React, { Component } from 'react';
import SVGIcons from "../../SVGIcons";
import Toast from "../Toast";
import TwoFa from "../TwoFa";
import {changeToast, changeUser, changeView} from "../../actions";
import {connect} from "react-redux";
import authHelper from '../../libs/authHelper.js';
import Popup from "../Popup";

class SettingsContent extends Component {

    constructor(props) {
        super();
        this.state = {
            pushEnabled:window.app.pushManager.state.isSubscribed
        }
    }

    componentDidMount()
    {
        /*window.helper.checkPermission('notifications', (isGranted) =>
        {
            console.log('isGranted',isGranted);
            this.setState({pushEnabled:isGranted});
        })*/
        window.app.socketManager.on('put:auth/TwoFa',this.onSetTwoFa.bind(this));
        //window.app.socketManager.on('put:auth/webAuth',this.onSetupWebAuth.bind(this));
        window.app.socketManager.on('put:auth/webAuthVerify',this.onSetupWebAuthDone.bind(this));
    }

    onSetTwoFa (dataUrl)
    {
        this.setState({twoFaDataUrl:dataUrl});
    }

    onSetupWebAuth (err,challengeMakeCred)
    {
        //console.log('put:auth/webAuthVerify',challengeMakeCred);
    }

    onSetupWebAuthDone (err,biometricLoginToken)
    {
        console.log('put:auth/webAuthVerify',err,'biometricLoginToken',biometricLoginToken);
        let user = this.props.user;
        let newUser;
        if (!err)
        {
            user.biometricLoginToken = biometricLoginToken;
            user.webAuthActive = true;
            localStorage.setItem('biometricLoginToken',biometricLoginToken);
        }
        else
        {
            user.biometricLoginToken = null;
            user.webAuthActive = false;
            localStorage.removeItem('biometricLoginToken');
        }
        newUser = Object.assign({},user);
        this.props.changeUser(newUser);
    }

    onTokenResponse ()
    {
        this.setState({twoFaDataUrl:false});
    }

    onChangeSettings (update)
    {
        window.app.socketManager.emit('put:users/settings',update)
    }

    onChange2FA (checked)
    {
        //console.log(`switch to ${checked}`);
        window.app.socketManager.emit('put:auth/TwoFa',checked)
    }

    onTouchIdChange (checked)
    {
        //console.log('onTouchIdChange',checked);
        window.app.socketManager.emit('put:auth/webAuthVerify',this.props.user.email,false)
    }

    renderItem (key,icon,text,state)
    {
        let inputProps = {};
        let rootProps = {
            key:key,
            className:'item',
            onClick:this.onChangeSetting.bind(this,key,!state)
        };
        if (key === '2FA' || key === 'WEBAUTH' || key === 'DARKMODE' || key === 'REDUCEDMOTION')
        {
            delete rootProps.onClick;
        }
        inputProps.key = 'input'+key+'-'+state;
        if ((key === '2FA' || key === 'WEBAUTH' || key === 'DARKMODE' || key === 'REDUCEDMOTION') && state)
        {
            inputProps.checked = state
        }
        return <div data-noselect="1" {...rootProps}>
            <div className="icon">
                <SVGIcons type={icon}/>
            </div>
            <div className="text">{text}</div>

            {key === '2FA' || key === 'WEBAUTH' || key === 'DARKMODE' || key === 'REDUCEDMOTION' ? <div className="switchContainer">
                <input {...inputProps} id={'switch'+key} onChange={this.onChangeSetting.bind(this,key,!state)} className="switch switchShadow" type="checkbox"/>
                <label htmlFor={'switch'+key}></label>
            </div> : false}
        </div>
    }

    onChangeSetting (key,value)
    {
        let user = this.props.user;
        console.log('onChangeSetting',key,value);
        //const { steps } = this.state;
        if (key === 'INSTALL')
        {
            window.helper.onAskForInstall(window.app.deferredInstallPrompt,function (installed)
            {
                console.log('installed',installed)
            })
        }
        if (key === 'PUSH')
        {
            //window.location.reload()
            if (this.state.pushEnabled)
            {
                window.app.pushManager.unsubscribeUser().then(() => {

                });
            }
            else
            {
                window.helper.checkPermission('notifications', (isGranted) =>
                {
                    console.log('isGranted',isGranted);
                    if (isGranted)
                    {
                        window.app.pushManager.subscribeUser().then((success) => {
                            this.setState({pushEnabled:true})
                        });
                    }
                    else
                    {
                        this.props.changeToast(<Toast text={'Please enable Push Notifications from settings'} timeout={7000}></Toast>)
                    }
                })
            }
        }
        if (key === 'RELOAD')
        {
            window.location.reload()
        }
        if (key === 'SHARE')
        {
            const shareData = {
                title: 'Pairly',
                text: 'Pairly is a messenger app that allows you to quickly start chatting',
                url: window.location.origin,
            };
            if ('share' in navigator)
            {
                navigator.share(shareData).then(() => {})
            }
            else
            {
                let text = shareData.url;
                navigator.clipboard.writeText(text).then(() => {
                    this.props.changeToast(<Toast text={'Link copied to clipboard!'} timeout={1300}></Toast>)
                }, function(err) {
                    //console.error('Async: Could not copy text: ', err);
                });
            }
        }

        if (key === '2FA')
        {
            //window.app.socketManager.emit('put:auth/TwoFa',this.props.user.twoFaActive)
        }

        if (key === 'WEBAUTH')
        {
            // Needs to be done directly after user interaction without making a request to server in between
            if (value)
            {
                const options = authHelper.preformatMakeCredReq(this.props.user);
                navigator.credentials.create(options).then(function (response)
                {
                    console.log('response',response);
                    let makeCredResponse = authHelper.publicKeyCredentialToJSON(response);
                    console.log('makeCredResponse',makeCredResponse);
                    window.app.socketManager.emit('put:auth/webAuthVerify',makeCredResponse,this.props.user.email,false);
                }.bind(this))
            }
            else
            {
                console.log('user',user);
                user.biometricLoginToken = null;
                user.webAuthActive = false;
                let newUser = Object.assign({},user);
                this.props.changeUser(newUser);
                localStorage.removeItem('biometricLoginToken');
            }
        }

        if (key === 'SIGNOUT')
        {
            localStorage.removeItem('token');
            window.location.reload();
        }

        if (key === 'DARKMODE')
        {
            this.setVisualSetting('darkModeActive','dark',value)
        }
        if (key === 'REDUCEDMOTION')
        {
            this.setVisualSetting('reducedMotionActive','reducedMotion',value)
        }
    }

    setVisualSetting (key,className,value)
    {
        let user = this.props.user;
        user[key] = value;
        let newUser = Object.assign({},user);
        this.props.changeUser(newUser);
        if (value && !document.documentElement.classList.contains(className))
        {
            document.documentElement.classList.add(className);
        }
        if (!value && document.documentElement.classList.contains(className))
        {
            document.documentElement.classList.remove(className);
        }
        let update = {};
        update[key] = user[key] ? 1 : 0;
        this.onChangeSettings(update);
    }

    render() {
        //console.log('this.props.user.webAuthActive',this.props.user.webAuthActive);
        return <div className="content settings">

                {!window.helper.isSupported('Notification') ? false : this.renderItem('PUSH','PUSH',<span className="pushText">{(window.app.pushManager.state.isSubscribed ? 'Disable' : 'Enable')+' Push Notifications'}</span>)}
                {window.app.deferredInstallPrompt ? this.renderItem('INSTALL','INSTALL','Install App') : false}
                {this.renderItem('SHARE','SHARE','Share this App')}
                {this.renderItem('RELOAD','RELOAD','Restart App')}
                {/*this.renderItem('2FA','2FA','Enable 2FA Login')*/}
                {this.renderItem('WEBAUTH','FACEID','Enable Face/Touch-ID Login',!!this.props.user.webAuthActive)}
                {this.renderItem('DARKMODE','THEME','Enable Darkmode',!!this.props.user.darkModeActive)}
                {this.renderItem('REDUCEDMOTION','MOTION','Enable Reduced Motion',!!this.props.user.reducedMotionActive)}
                {this.renderItem('SIGNOUT','SIGNOUT','Sign out')}
                {this.renderItem('VERSION','INFO',<span>
                    <span>App Version: {window.VERSION_APP}</span> <span>Worker Version: {window.VERSION_SERVICE_WORKER}</span>
                </span>)}

                {this.state.twoFaDataUrl ? <TwoFa onTokenResponse={this.onTokenResponse.bind(this)} qrCode={this.state.twoFaDataUrl}></TwoFa> : false}

        </div>
    };
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

export default connect(mapStateToProps, mapDispatchToProps,null,{forwardRef: true})(SettingsContent)