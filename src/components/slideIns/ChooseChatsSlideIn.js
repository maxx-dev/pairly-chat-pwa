import React from 'react';
import SlideIn from "./SlideIn";
import ChatList from "../../views/ChatList";

export default class ChooseChatsSlideIn extends SlideIn {

    constructor() {
        super();
        this.state = {};
        this.root = React.createRef();
        this.chatList = React.createRef();
    }

    componentDidMount()
    {
        super.componentDidMount();
        console.log(this);
    }

    onSearch (search)
    {
        this.setState({search:search});
    }

    onActiveChatChanged (chatCard,chat)
    {
        console.log('onActiveChatChanged',chat);
        //this.setState({activeChatCard:chat});
    }

    renderChatList ()
    {
        return <ChatList ref={this.chatList} view={'SHARE'} className={[]} search={this.state.search} onActiveChatChanged={this.onActiveChatChanged.bind(this)} user={this.props.user}></ChatList>
    }

    removeFilePreview ()
    {
        this.props.removeFilePreview();
    }

    onSendFile ()  // Send each file to each selected chat
    {
        //console.log('onSendFile',window.app.sharedFiles);
        let selectedChats = this.chatList.current.getSelectedChats();
        //console.log('selectedChats',selectedChats);
        if (window.app.sharedFiles)
        {
            for (let s=0;s<window.app.sharedFiles.length;s++)
            {
                let file = window.app.sharedFiles[s];
                for (let s=0;s<selectedChats.length;s++)
                {
                    let chat = selectedChats[s];
                    let msg = window.app.msgBuilder.prepareFileMsg(file);
                    this.props.onFileReady(file.file,msg.uuid);
                    msg.chatId = chat.props.chat.id;
                    //console.log('Sending file',file,'to',msg.chatId);
                    this.props.onSendMsg(msg);
                }
            }
        }
        this.goBack();
    }

    render() {
        return (
            <div ref={this.root} className="chooseChats slideIn">
                <div data-depth="1" className="depthWrapper">
                    {this.renderHeader('New Chat')}
                    <div className="content">
                       {this.renderChatList()}
                    </div>
                    <div className="btns">
                        {/*<div onClick={this.removeFilePreview.bind(this)} className="def-btn">Abort</div>*/}
                        <div onClick={this.onSendFile.bind(this)} className="def-btn">Send</div>
                    </div>
                </div>
            </div>
        );
    };
}
