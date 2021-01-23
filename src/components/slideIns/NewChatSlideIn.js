import React, { Component } from 'react';
import SlideIn from "./SlideIn";
import SearchBar from "../SearchBar";
import SVGIcons from "../../SVGIcons";
import Toast from "../Toast";

export default class NewChatSlideIn extends SlideIn {

    constructor() {
        super();

        let contacts = [];
        this.state = {
            key:'ROOT',
            steps:[],
            contacts:contacts
        };
        this.root = React.createRef();
    }

    onSearch (search)
    {
        this.setState({search:search});
    }

    canPickContacts ()
    {
        return ('contacts' in navigator && 'ContactsManager' in window);
    }

    pickContacts ()
    {
        const props = ['name', 'email'];
        const opts = {multiple: true};
        navigator.contacts.select(props, opts).then(this.onPickedContacts.bind(this));
    }

    onPickedContacts (contacts)
    {
        console.log('onPickedContacts',contacts);
        contacts.map((contact) =>
        {
            let nameArr = contact.name[0].split(' ');
            if (nameArr.length >= 2)
            {
                contact.firstName = nameArr.shift();
                contact.lastName = nameArr.join(' ');
            }
            contact.email = contact.email[0];
            contact.name = contact.name[0];
            contact.selected = true
        });
        this.setState({contacts:contacts});
    }

    toggleContactSelect (contact)
    {
        const { contacts } = this.state;
        contact.selected = !contact.selected;
        this.setState({contacts});
    }

    renderContact (contact,index)
    {
        //console.log('contact',arguments);
        if (contact.name && contact.name[0])
        {
            let nameArr = contact.name.split(' ');
            let firstNameLetter = contact.firstName[0]
            let lastNameLetter =  contact.lastName[0];
            return <div data-selected={contact.selected ? 1 : 0} onClick={this.toggleContactSelect.bind(this,contact)} key={'contact_'+index} className="contact">
                <div className="icon">
                    <div>{firstNameLetter}{lastNameLetter}</div>
                </div>
                <div className="content">
                    <div className="name">{contact.name}</div>
                    <div className="email">{contact.email}</div>
                </div>
                <div className="action">
                    <SVGIcons type="CLOSE_CHECK"/>
                </div>
            </div>
        }
    }

    createChats ()
    {
        const { contacts } = this.state;
        window.app.socketManager.emit('post:chats/invite',contacts);
        this.goBack();
    }

    renderNotSupported ()
    {
        return <div className="notSupported">
            <h2>Sorry, the Contact Picker API is not supported in this browser</h2>
        </div>
    }

    onShareLink ()
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
            navigator.clipboard.writeText(shareData.url).then(() => {
                //console.log('Async: Copying to clipboard was successful!');
                this.props.changeToast(<Toast text={'Text copied to clipboard!'} timeout={1300}></Toast>)
            }, function(err) {
                //console.error('Async: Could not copy text: ', err);
            });
        }
    }


    renderShareViaLink ()
    {
        return <div onClick={this.onShareLink.bind(this)} className="shareViaLink">
            Share this link to invite other users to Pairly:
            <div className="def-btn" style={{textTransform:'none'}}>{window.location.origin}</div>
        </div>
    }

    render() {
        const { contacts } = this.state;
        let selectedContacts = contacts.filter((contact) => contact.selected).length;
        return (
            <div ref={this.root} className="newChat slideIn">
                <div data-depth="1" className="depthWrapper">
                    {this.renderHeader('New Chat')}
                    <div className="content">
                        {this.canPickContacts() ? <div onClick={this.pickContacts.bind(this)} className="def-btn pickContacts">Choose Contacts</div> : this.renderNotSupported()}
                        {!contacts.length ? this.renderShareViaLink() : false}
                       <div className="contacts">
                           {contacts.map(this.renderContact.bind(this))}
                           {selectedContacts !== 0 ? <div onClick={this.createChats.bind(this)} className="selected">Create {selectedContacts} Chats</div> : false}
                       </div>
                    </div>
                </div>
            </div>
        );
    };
}
