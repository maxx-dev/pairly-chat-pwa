import React, { Component } from 'react';
import SVGIcons from "../SVGIcons";
import UserProfileImg from "./UserProfileImg";

export default class ChatCard extends Component {
    constructor(){
        super()
        this.state = {}
    }

    componentDidMount()
    {
       if (this.props.didMount) this.props.didMount(this)
    }

    toggleActive ()
    {
        let active = !this.state.active;
        this.setState({active:active});
        return active;
    }

    toggleSelected ()
    {
        let active = !this.state.selected;
        this.setState({selected:active});
        return active;
    }

    renderOnlineStatus ()
    {
        const { chat, view } = this.props;
        if (!chat) return false;
        let user = chat.user;
        //console.log('user',user);
        let lastOnline = this.timeSpan(user.lastOnlineAt);
        return <div className="onlineStatus textCont">{user.isOnline ? 'online' : (lastOnline ? 'last online '+lastOnline : 'offline')}</div>
    }

    timeSpan (date)
    {
        let now = new Date();
        if (!date)
        {
            return;
        }
        //console.log('date',date);
        let diff = now.getTime() - date.getTime();
        if (diff < 1000 * 60*29) // one hour
        {
            let mins = Math.ceil(diff/1000/60);
            return mins+' minute'+(mins === 1 ? '' : 's')+' ago';
        }
        let time = window.helper.pad(date.getHours())+':'+window.helper.pad(date.getMinutes());
        if (date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) // same day
        {
            return 'today at '+time;
        }
        return 'on '+window.helper.pad(date.getDate())+'.'+window.helper.pad(date.getMonth())+'.'+date.getFullYear()+' '+time;
    }

    renderNames ()
    {
        const { chat } = this.props;
        let user = chat.user;
        let firstName = [user.firstName];
        let lastName = [user.lastName];
        if (this.props.matchingSearchPart)
        {
            firstName = user.firstName.split(new RegExp(`(${this.props.matchingSearchPart})`, 'gi'));
            lastName = user.lastName.split(new RegExp(`(${this.props.matchingSearchPart})`, 'gi'));
        }
        //let matchesFirstName = user.firstName.toLowerCase().indexOf(this.props.matchingSearchPart) !== -1;
        //let matchesLastName = user.lastName.toLowerCase().indexOf(this.props.matchingSearchPart) !== -1;
        //console.log('lastName',lastName,'this.props.matchingSearchPart',this.props.matchingSearchPart);
        let renderName = (name,key) => {
           return name.map((val,index) => {return <span className={(this.props.matchingSearchPart && this.props.matchingSearchPart.toLowerCase() === val.toLowerCase() ? 'matchedText' : '')+' textCont'} key={key+index}>{val}</span>})
        };

        return <div className="name">
            {renderName(firstName,'firstName_')}<span>&nbsp;</span>{renderName(lastName,'lastName_')}
        </div>
    }

    renderLastMsgAt ()
    {
        const { chat, view } = this.props;
        //let latestMsg = chat.msgs[chat.msgs.length-1];
        let latestMsg = chat.latestMsg;
        //console.log('latestMsg',latestMsg);
        if (latestMsg)
        {
            let today = new Date();
            let yesterday = new Date();
            yesterday.setDate(yesterday.getDate() -1);
            let isToday = window.helper.isSameDay(latestMsg.createdAt,today);
            let isYesterday = window.helper.isSameDay(latestMsg.createdAt,yesterday);
            let txt = window.helper.pad(latestMsg.createdAt.getDate())+'.'+window.helper.pad(latestMsg.createdAt.getMonth())+'.'+latestMsg.createdAt.getFullYear();
            if (isToday) txt = 'Today';
            if (isYesterday) txt = 'Yesterday';
            return <div className="date textCont">{txt}</div>
        }
    }

    onAudioReady (e)
    {
        const { chat, view } = this.props;
        let dur = document.querySelector('.chatCard[data-chatid="'+chat.userChat.chatId+'"] .duration');
        //let audio = document.querySelector('.chatCard[data-chatid="'+chat.userChat.chatId+'"] audio');
        let audio = this.audio;
        //console.dir(audio);
        //console.log('currentTime',audio.duration);
        if (dur)
        {
            dur.innerHTML = window.helper.userFormatDurationFromMs(audio.duration * 1000);
        }
    }

    getMsgFileFromApi (msg)
    {
        return window.location.origin+'/api/media/'+msg.text+'/'+localStorage.getItem('token')
    }

    renderLastMsg ()
    {
        const { chat, view } = this.props;
        let classNames = ['lastMsg','textCont'];
        let latestMsg = chat.latestMsg;

        //console.log('latestMsg',chat.userChat.chatId,latestMsg);
        let content = '-';
        if (latestMsg)
        {
            if (latestMsg.type === 'AUDIO')
            {
                this.audio = new Audio();
                //if (/iPad|iPhone|iPod/.test(navigator.userAgent)) this.audio.autoplay = true; // https://stackoverflow.com/questions/33300294/html5-video-loadeddata-event-does-not-work-in-ios-safari
                this.audio.src = this.getMsgFileFromApi(latestMsg);
                this.audio.onloadeddata = this.onAudioReady.bind(this); // does not work under ios
                content = <span className="audio">
                    <SVGIcons type="MICRO"/>
                    {/*<audio style={{display:'none'}} onLoadedData={this.onAudioReady.bind(this)} src={'api/'+latestMsg.text+'/'+localStorage.getItem('token')}></audio>*/}
                    <span className="duration">Audio</span>
                </span>
            }
            else if (latestMsg.type === 'IMAGE')
            {
                content = <span className="image">
                    <SVGIcons type="PHOTO"/>
                    <span className="">Image</span>
                </span>
            }
            else if (latestMsg.type === 'VIDEO')
            {
                content = <span className="video">
                    <SVGIcons type="VIDEO"/>
                    <span className="">Video</span>
                </span>
            }
            else if (latestMsg.type === 'LOCATION')
            {
                content = <span className="location">
                    <SVGIcons type="LOCATION"/>
                    <span>Location</span>
                </span>
            }
            else
            {
                content = latestMsg.text;
            }
        }

        return <div data-type={latestMsg ? latestMsg.type : ''} className={classNames.join(' ')}>{content}</div>
    }

    getUnreadMsgs ()
    {
        const { chat, view, user } = this.props;
        //console.log('user',user);
        //return chat.msgs.filter((msg) => msg.userId !== user.id && msg.state !== 2);
        return chat.unreadCount || 0;
    }

    renderIsUnreadBubble ()
    {
        const { chat, view, user } = this.props;
        let unreadCount = this.getUnreadMsgs();
        //console.log('unreadCount',unreadCount,chat.userChat.chatId);
        if (unreadCount === 0) return false;
        return <div className="unreadBubble">
            <span>{unreadCount}</span>
        </div>
    }

    onImgErr (e)
    {
        //console.log('onImgErr',e);
        this.setState({imgLoadError:true})
        e.target.style.display = 'none';
    }

    renderImg ()
    {
        const { chat } = this.props;
        return <UserProfileImg user={chat.user} onImgErr={this.onImgErr.bind(this)}></UserProfileImg>
    }

    render() {

        const { selected, imgLoadError } = this.state;
        const { chat, view } = this.props;
        let imgProps = {};
        if (imgLoadError) imgProps['data-loaderror'] = 1;
        if (!chat) return false;
        let user = chat.user;
        //console.log('ChatCard',chat);
        if (view === 'HEADER')
        {
           // console.log('charChard',chat)
        }
        return (
            <div data-chatid={chat.userChat.chatId} data-unread={chat.unreadCount} data-selected={this.state.selected ? 1 : 0} data-active={chat.active ? 1 : 0} onClick={this.props.onClick.bind(this,this,chat)} data-view={view} className='chatCard'>

                {window.helper.isMobileView() && view === 'HEADER' ? <div onClick={this.props.onClickBack.bind(this)} className="back">
                    <SVGIcons type="BACK"></SVGIcons>
                </div> : false}
                <div {...imgProps} className="img">
                    {this.renderImg()}
                </div>
                <div className="content">
                    <div className="headline">
                        {this.renderNames()}
                        {view !== 'HEADER' && view !== 'SHARE' ? this.renderLastMsgAt() : false}
                    </div>
                    {view !== 'SHARE' ? <div className="subHeader">
                        {view === 'HEADER' ? this.renderOnlineStatus() : false }
                        {view !== 'HEADER' ? this.renderLastMsg() : false}
                        {view !== 'HEADER' ? this.renderIsUnreadBubble() : false }
                    </div> : false}
                    {view === 'SHARE' ? <div className="select">
                        {selected ?  <SVGIcons type="CLOSE_CHECK"/> : <SVGIcons type="CIRCLE"/>}
                    </div> : false }
                </div>

            </div>
        );
    }
}