import React from 'react';

class TwoFa extends React.Component {

    constructor(props)
    {
        super(props);
        this.twoFaTokenCont = React.createRef();
        this.modal = React.createRef();
        this.state = {

        };
    }

    componentDidMount()
    {
        window.app.socketManager.on('get:auth/verifyTwoFaToken', function (resCode,user,token)
        {
            console.log('get:auth/verifyTwoFaToken',resCode,token);
            if (window.app.user)
            {
                window.app.user.twoFaActive = 1;
            }
            this.setState({verifyTokenRes:resCode});
            if (this.props.onTokenResponse)
            {
                this.props.onTokenResponse(resCode === 'SUCCESS',user,token);
            }
        }.bind(this));
        setTimeout(function ()
        {
            //console.log(this.twoFaTokenCont);
            //console.log(this.modal);
            if (this.twoFaTokenCont)
            {
                this.twoFaTokenCont.current.children[0].focus();
            }
        }.bind(this),1000)
    }

    getToken ()
    {
        let token = '';
        for (let s=0;s<6;s++)
        {
            token += this.twoFaTokenCont.current.children[s].value;
        }
        return token
    }

    confirm ()
    {
        let token = this.getToken();
        let email = this.props.getEmail ? this.props.getEmail() : window.app.user.email;
        //console.info('email',email,token);
        if (!email)
        {
            console.error('email is not set');
            return;
        }
        //console.log('',token);
        window.app.socketManager.emit('get:auth/verifyTwoFaToken',email,token);
        //this.setState({twoFaDataUrl:false});
    }

    onCloseConfirmModal (res)
    {
        if (res)
        {
            this.confirm();
        }
        else
        {
            this.props.onTokenResponse(false,false,false);
        }
    }

    componentWillUnmount()
    {
        window.app.socketManager.removeAllListeners('get:auth/verifyTwoFaToken');
    }

    onTwoFaTokenChange (index,e)
    {
        let event = e.nativeEvent;
        //console.log(e);
        if (event.keyCode === 8 && event.target.previousElementSibling &&  event.target.previousElementSibling.focus)
        {
            event.target.value = '';
            event.target.previousElementSibling.focus();
        }
        if (event.target.value.length ===1 &&  event.target.nextElementSibling &&  event.target.nextElementSibling.focus)
        {
            event.target.nextElementSibling.focus();
        }

        let token = this.getToken();
        if (token.length === 6 && event.keyCode === 13)
        {
            this.confirm();
        }
    }

    onTwoFaTokenPaste (e)
    {
        let clipboardText = e.clipboardData.getData('text/plain');
        //console.log('clipboardText',clipboardText);
        if (clipboardText && clipboardText.length === 6)
        {
            for (let s=0;s<6;s++)
            {
                this.twoFaTokenCont.current.children[s].value = clipboardText[s];
            }
        }
    }

    render() {

        let props = {

            onPaste:this.onTwoFaTokenPaste.bind(this),
            maxLength:1
        }
        return (
            <div ref={this.modal} className={'twoFa'}>
                {this.props.qrCode ? <h4>Scan QRCode:</h4> : false}
                {this.props.qrCode ? <img className="twoFaQrCode" src={this.props.qrCode}></img> : false}
                <h4>Enter Code:</h4>
                <div ref={this.twoFaTokenCont} className={'twoFaTokenCont'+(this.state.verifyTokenRes === 'ERROR' ? ' error' : '')}>
                    <input {...props} onKeyUp={this.onTwoFaTokenChange.bind(this,0)}></input>
                    <input {...props} onKeyUp={this.onTwoFaTokenChange.bind(this,1)}></input>
                    <input {...props} onKeyUp={this.onTwoFaTokenChange.bind(this,2)}></input>
                    <input {...props} onKeyUp={this.onTwoFaTokenChange.bind(this,3)}></input>
                    <input {...props} onKeyUp={this.onTwoFaTokenChange.bind(this,4)}></input>
                    <input {...props} onKeyUp={this.onTwoFaTokenChange.bind(this,5)}></input>
                </div>
                {this.state.verifyTokenRes === 'ERROR' ? <div className="validation">Wrong Code</div> : false}

            </div>
        );
    }
}

export default TwoFa