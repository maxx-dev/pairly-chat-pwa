import React, { Component } from "react";
import Chat from "../views/Chat";
import SideBar from "./SideBar";
import SVGIcons from "../SVGIcons";
import {changeToast, changeUser, changeView, changeModal} from "../actions";
import {connect} from "react-redux";
import ChatList from "../views/ChatList";
import SearchBar from "./SearchBar";
import NewChatSlideIn from "./slideIns/NewChatSlideIn";
import ProfileSlideIn from "./slideIns/ProfileSlideIn";
import SettingsContent from "./content/SettingsContent";
import socketIOClient from "socket.io-client";
import SocketManager from "../SocketManager";
import PushManager from "../PushManager";
import Toast from "./Toast";
import ChooseChatsSlideIn from "./slideIns/ChooseChatsSlideIn";
import SettingsSlideIn from "./slideIns/SettingsSlideIn";
import ChangeProfileImageSlideIn from "./slideIns/ChangeProfileImageSlideIn";
import Popup from "./Popup";
import Modal from "./modals/Modal";

class ChatContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			toggle: false,
			username: this.props.username,
			userList: [

			],
			messages: [],
			image: null,
			activeChatCard:false,

		};
		this.blobs = {};
		for (let s=0;s<props.user.chats.length;s++)
		{
			if (props.user.chats[s].active)
			{
				this.state.activeChatCard = props.user.chats[s];
			}
		}

		this.ref = {
			activeChatCard:React.createRef()
		};
		let socket = socketIOClient({query:'token='+localStorage.getItem('token')+'&version='+process.env.VERSION});
		window.app.socketManager = new SocketManager(socket);
		window.app.pushManager = new PushManager();
		this.initSocketEvents();
	}

	componentDidMount() {

		//console.log('Event Listener Created',window.app.sharedFiles);
		//window.addEventListener("beforeunload", (event) => {});
		//window.addEventListener("ReceivedSharedFiles", this.onReceivedSharedFiles.bind(this));
		// TO-DO Reenable
		window.helper.loadScript('https://maps.googleapis.com/maps/api/js?key='+process.env.GOOGLE_MAPS_KEY+'&callback=initMap')
		/*setTimeout(() => {

			console.log('user timeout',this.props.user.id,this.props.user);
		},2000)/**/
		if (window.app.sharedFiles && window.app.sharedFiles.length)
		{
			this.onReceivedSharedFiles();
		}
	}

	componentWillUnmount() {

	}

	initSocketEvents ()
	{
		//window.app.socketManager.on('get:auth', this.onAuth.bind(this));
		window.app.socketManager.on('connect', this.onConnect.bind(this));
		window.app.socketManager.on('disconnect', this.onDisconnect.bind(this));
		window.app.socketManager.on('reconnect', this.onReconnect.bind(this));
		window.app.socketManager.on('put:statusChanged', this.onStatusChange.bind(this));
		window.app.socketManager.on('post:message', this.onNewMsg.bind(this));
		window.app.socketManager.on('post:message/uploadReady', this.onNewMsgUploadReady.bind(this));
		window.app.socketManager.on('put:messageArrived', this.onMsgArrived.bind(this));
		window.app.socketManager.on('put:messageRead', this.onMsgRead.bind(this));
		window.app.socketManager.on('post:chats/invite', this.onInvitedNewUsers.bind(this));
		window.app.socketManager.on('get:appInfos', this.onGetAppInfos.bind(this));
	}

	onConnect (e) // Also triggered on reconnect
	{
		//console.log('onConnect');
		window.dispatchEvent(new CustomEvent('SocketConnected'));
		this.setState({socketConnected:true});
		this.props.sendQueuedMsgs();
		window.app.socketManager.emit('get:appInfos');
	}

	onDisconnect ()
	{
		this.setState({socketConnected:false});
	}

	onReconnect (e)
	{
		console.info('onReconnect',e);
		window.dispatchEvent(new CustomEvent('SocketReconnected'));
	}

	onGetAppInfos (appInfos)
	{
		this.props.onGetAppInfos(appInfos);
	}

	loadSharedFiles ()
	{
		return new Promise( (resolve) =>
		{
			let sharedFiles = window.app.sharedFiles;
			let doneCount = 0;
			for (let s=0;s<sharedFiles.length;s++)
			{
				let file = sharedFiles[s];
				this.readFile(file.file).then((binary) => {
					file.binary = binary;
					doneCount++;
					if (doneCount === sharedFiles.length)
					{
						console.log('All files Done');

						resolve([null,sharedFiles])
					}
				})
			}
		})
	}

	readFile (file)
	{
		return new Promise(resolve => {
			const reader = new FileReader();
			reader.onload = function (e) {
				//console.log(e.target.result);
				resolve(e.target.result);
			};
			//reader.readAsBinaryString(file);
			reader.readAsDataURL(file);
		});
	}

	async onReceivedSharedFiles (e)
	{
		//let [err,sharedFiles] = await this.loadSharedFiles(window.app.sharedFiles);
		//let sharedFiles = e.detail.sharedFiles
		console.log('onReceivedSharedFiles after loading',window.app.sharedFiles);
		//this.setState({slideInView:this.slideInViewProvider('ChooseChatsSlideIn')});
		this.setState({slideInView:'ChooseChatsSlideIn'})
	}

	onStatusChange (status)
	{
		let chat = window.helper.getChatByUserId(this.props.user,status.userId);
		//console.info('onStatusChange',status,chat ? chat.id : false);
		if (chat)
		{
			chat.user.isOnline = status.isOnline;
			if (status.lastOnlineAt)
			{
				chat.user.lastOnlineAt = new Date(status.lastOnlineAt);
			}
			else
			{
				chat.user.lastOnlineAt = false;
			}
			this.state.activeChatCard.user = chat.user;
		}
		this.props.changeUser(this.props.user);
		this.setState({activeChatCard:this.state.activeChatCard});
	}

	onNewMsgUploadReady (msg)
	{
		console.log('onNewMsgUploadReady',msg,msg.mimeType);
		if (msg.uploadUrl)
		{
			//console.log(this);
			this.getFile(msg.uuid).then((blob) => {
				console.log('getFile',blob);
				if (blob)
				{
					window.helper.uploadFile(blob.result, msg.uploadUrl, {mimeType: msg.mimeType},this.onFileUploaded.bind(this,msg), this.onFileUploadProgress.bind(this));
				}
			});
		}
	}
	onFileUploaded (msg)
	{
		//console.log('Uploaded File',msg.uuid,msg.uploadUrl);
		this.removeFile(msg.uuid);
		window.app.socketManager.emit("post:message", msg,{onlyEmit:true});
	}

	onFileUploadProgress (e)
	{
		//console.log('onFileUploadProgress',e.percent);
	}

	onNewMsg (msg)
	{
		console.log(new Date().toISOString(),'onNewMsg',msg);
		if (!window.helper.isOwnMsg(this.props.user,msg.userId))
		{
			let isActiveInChat = this.props.view.view === 'CHAT' && this.state.activeChatCard.userChat.chatId;
			//console.log('Directly set as read',isActiveInChat);
			if (isActiveInChat) // if user is active in chat we directly set message as read
			{
				msg.state = 2
				window.app.socketManager.emit('put:messageRead',msg);
			}
			else
			{
				msg.state = 1;
				window.app.socketManager.emit('put:messageArrived',msg);
			}
			if (navigator.vibrate) window.navigator.vibrate(200);
		}
		//let chat = window.helper.getChatByUserId(this.props.user,msg.userId);
		let chat = window.helper.getChatById(this.props.user,msg.chatId);
		if (chat)
		{
			msg.createdAt = new Date(msg.createdAt);
			//if (!chat.msgs) chat.msgs = [];
			//chat.msgs.push(msg);
			chat.latestMsg = msg;
			if (msg.userId !== this.props.user.id && msg.state === 0)
			{
				if (!chat.unreadCount) chat.unreadCount = 0;
				chat.unreadCount++;
			}
		}
		else
		{
			console.error('Chat not found ', msg.chatId)
		}
		this.props.changeUser(this.props.user);
		//console.log(this);
		let chatCont = this
		if (chatCont.state.activeChatCard && chatCont.state.activeChatCard.userChat && chatCont.state.activeChatCard.userChat.chatId === msg.chatId)
		{
			chatCont.ref.activeChatCard.current.onNewMsg(msg);
		}
		else
		{
			console.log('Msg in not active/focused chat');
		}

		this.updateUnreadMsgBadge();
	}

	updateUnreadMsgBadge ()
	{
		let totalUnreadCount = 0;
		for (let s=0;s<this.props.user.chats.length;s++)
		{
			let chat = this.props.user.chats[s];
			if (chat.unreadCount) totalUnreadCount += chat.unreadCount;
		}

		//console.log('totalUnreadCount',totalUnreadCount);
		if (totalUnreadCount)
		{
			if (navigator.setAppBadge)
			{
				navigator.setAppBadge(totalUnreadCount);
			}
		}
		else
		{
			if (navigator.clearAppBadge) navigator.clearAppBadge();
		}
	}

	onMsgArrived (msg)
	{
		//console.log('onMsgArrived',msg);
		this.updateMsgStatus(msg,1);
	}

	onMsgRead (msg)
	{
		//console.log('onMsgRead',msg);
		this.updateMsgStatus(msg,2);
	}

	onInvitedNewUsers (chats)
	{
		this.props.changeToast(<Toast text={'Users invited!'}></Toast>);
		console.log('onInvitedNewUsers',chats);
		let { user } = this.props;
		user.chats = user.chats.concat(chats);
		//this.setState({user});
		this.props.changeUser(user);
	}

	updateMsgStatus (msg,status)
	{
		let chatCont = this;
		if (chatCont.state.activeChatCard && chatCont.state.activeChatCard.userChat && chatCont.state.activeChatCard.userChat.chatId === msg.chatId)
		{
			chatCont.ref.activeChatCard.current.onUpdateMsgStatus(msg.id,status);
		}
		else
		{
			console.log('Msg in not active/focused chat');
		}
	}

	onActiveChatChanged (chatCard,chat)
	{
		//console.log('onActiveChatChanged',chat);
		if (this.state.activeChatCard)
		{
			this.state.activeChatCard.active = false
			//this.state.activeChatCard.toggleActive();
		}
		if (chat)
		{
			chat.active = true;
			this.props.changeView({view:'CHAT'});
		}
		else
		{
			this.props.changeView({view:'CHATS'});
		}
		this.setState({activeChatCard:chat});
	}

	onOpenProfile ()
	{
		console.log('onOpenProfile');
		this.setState({profileActive:!this.state.profileActive});
	}

	onOpenMyProfile ()
	{
		console.log('onOpenMyProfile');
	}

	reconnect () {
		if (window.socket.disconnected) {
			/*const reconnect = window.confirm(
				"You have been disconnected, would you like to reconnect?"
			);*/
			let reconnect = true;
			/*if (reconnect) {
				window.app.socketManager.emit("join", {
					username: this.props.username,

					id: this.props.id,
					room: this.props.room.toLowerCase()
				});
			} else {
				this.props.history.push("/");
			}*/
		}
	};

	getActiveChat ()
	{
		return this.state.activeChatCard;
	}

	onChangeMsg (value,chatRoom) {


	};

	mobileToggle () {
		this.setState((prevProps) => {
			return {
				toggle: !prevProps.toggle
			};
		});
	};

	onSendMsg (msg,opts = {})
	{
		if (msg && (msg.text || msg.type === 'AUDIO' || msg.type === 'IMAGE' || msg.type === 'VIDEO' ||  msg.type === 'LOCATION' ||  msg.type === 'OTHER')) {

			if (!msg.chatId)
			{
				let chat = this.getActiveChat();
				msg.chatId = chat.userChat.chatId;
			}
			console.log('msg before emit',msg.uuid,msg);
			window.app.socketManager.emit('post:message', msg);
		}
	};


	onFileReady (file,uuid)
	{
		console.log('onFileReady',uuid,file);
		/*if (this.blobs[uuid] && typeof this.blobs[uuid] === 'function')
		{
			this.blobs[uuid](file);
		}
		else
		{
			this.blobs[uuid] = file;
		}*/
		window.app.cacheManager.set(uuid,file).then( ([err,res]) => {});
	}

	async getFile (uuid)
	{
		return new Promise((resolve, reject) => {

			/*if (this.blobs[uuid])
			{
				//console.log('File already ready');
				resolve(this.blobs[uuid])
			}
			else
			{
				console.log('File not yet ready for',uuid,this.blobs);
				this.blobs[uuid] = resolve;
			}*/
			 window.app.cacheManager.get(uuid).then( ([err,file]) => {
				 if (file)
				 {
					 resolve(file)
				 }
				 else
				 {
					// resolve
					 console.log('File not yet ready for',uuid,this.blobs);
				 }
			});
		})
	}

	removeFile (uuid)
	{
		delete this.blobs[uuid];
	}

	grabFile (input) {
		var reader = new FileReader();
		console.log();
		reader.addEventListener(
			"load",
			() => {
				window.app.socketManager.emit("message", {
					id: this.props.id,
					room: this.state.room,
					username: this.state.username,
					image: reader.result
				});
			},
			false
		);

		if (input.files[0]) {
			reader.readAsDataURL(input.files[0]);
		}
	};

	toggleFunc() {
		this.setState((prevState) => {
			return {
				toggle: !prevState.toggle
			};
		});
	};

	renderNoActiveChat ()
	{
		return 	<div className="chat intro">

			<div className="wrapper">
			<div className="connectionImg">
				<svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 1280 1024" version="1.1">
					<path d="M640 576c105.856 0 201.856 43.072 271.424 112.576l-90.496 90.496C774.592 732.736 710.592 704 640 704s-134.592 28.736-180.928 75.072l-90.496-90.496A382.848 382.848 0 0 1 640 576zM187.456 507.456C308.352 386.56 469.056 320 640 320s331.648 66.56 452.544 187.456l-90.496 90.496C905.344 501.248 776.768 448 640 448s-265.344 53.248-362.048 149.952L187.456 507.456zM988.8 134.464a893.824 893.824 0 0 1 284.8 192l-90.496 90.496C1038.016 271.936 845.184 192 640.064 192S242.048 271.872 97.024 416.96L6.528 326.464A893.12 893.12 0 0 1 640.128 64c120.96 0 238.272 23.68 348.8 70.464zM576 896a64 64 0 1 1 128 0 64 64 0 0 1-128 0z"/>
				</svg>
			</div>
			<div className="connectionExplainer">
				<h1 className="">Stelle sicher,
				dass dein Handy weiterhin mit dem Internet verbunden bleibt.</h1>
				<div className="sub">PWA Chat verbindet sich mit deinem Telefon, um Nachrichten zu synchronisieren.
					Verbinde dein Telefon mit einem WLAN, um den Datenverbrauch zu reduzieren.
				</div>
				<div className="conn">
					<div className="_1X4Oi"></div>
					<div className="_1pNt0"><span className="W55U1"><span data-icon="laptop" className=""><SVGIcons type={'LAPTOP'}/></span></span>
						{/*<div className="_1LQvt">WhatsApp ist für Mac verfügbar. <a href="https://www.whatsapp.com/download" target="_blank">Hol es dir hier</a></div>*/}
					</div>
				</div>
			</div>
			</div>
		</div>
	}

	onAllChatMsgsRead (msgs)
	{
		//console.log('onAllMsgsRead',msgs);
		let { activeChatCard } = this.state;
		let latestMsg = msgs[msgs.length -1];
		if (latestMsg)
		{
			activeChatCard.unreadCount = 0;
			activeChatCard.latestMsg.state = latestMsg.state;
		}
		this.setState({activeChatCard:activeChatCard});
		this.updateUnreadMsgBadge();
	}

	onMobileMenuClick (key)
	{
		console.log('onMobileMenuClick',key);
		this.props.changeView({view:key});
	}

	canShowMobileMenu ()
	{
		//return !this.state.slideInView || (this.state.slideInView && this.state.slideInView.type.name !== 'ChooseChatsSlideIn' && this.state.slideInView.type.name !== 'NewChatSlideIn')
		return !this.state.slideInView || (this.state.slideInView !== 'ChooseChatsSlideIn' && this.state.slideInView !== 'NewChatSlideIn')
	}

	renderMobileMenu ()
	{
		return this.canShowMobileMenu() ? <div className="mobileMenu">
			{this.renderMobileMenuItem('CHATS','BUBBLE','Chats')}
			{this.renderMobileMenuItem('SETTINGS','SETTINGS','Settings')}
		</div> : false
	}

	renderMobileMenuItem (key,icon,title)
	{
		let { view } = this.props;
		return <div data-key={key} onClick={this.onMobileMenuClick.bind(this,key)} className={'item'+(view.view === key ? ' active' : '')}>
			<div className="icon">
				<SVGIcons type={icon}/>
			</div>
			<div className="text">{title}</div>
		</div>
	}

	renderViewChat ()
	{
		return <div data-view={"CHAT"} className="view">
			{this.state.activeChatCard ? <Chat key={this.state.activeChatCard.userChat.chatId}
											   onActiveChatChanged={this.onActiveChatChanged.bind(this)}
											   onOpenProfile={this.onOpenProfile.bind(this)}
											   activeChatCard={this.state.activeChatCard}
											   onAllChatMsgsRead={this.onAllChatMsgsRead.bind(this)}
											   ref={this.ref.activeChatCard}
											   image={this.state.image}
											   grabFile={this.grabFile}
											   onChangeMsg={this.onChangeMsg.bind(this)}
											   onSendMsg={this.onSendMsg.bind(this)}
											   onFileReady={this.onFileReady.bind(this)}/> : false}
		</div>
	}

	renderChatList (view)
	{
		return <ChatList view={view} className={[]} search={this.state.search} onActiveChatChanged={this.onActiveChatChanged.bind(this)} user={this.props.user}></ChatList>
	}

	onSearch (search)
	{
		this.setState({search:search});
	}

	onShowNewChatSlideIn ()
	{
		//this.setState({slideInView:this.slideInViewProvider('NewChatSlideIn')})
		this.setState({slideInView:'NewChatSlideIn'})
	}

	renderViewHeader ()
	{
		let { view } = this.props;
		return  <header>
			{view.view === 'CHATS' || view.view === 'CHAT' ? <div className="top">
				<h1>Chats</h1>
				<div onClick={this.onShowNewChatSlideIn.bind(this)} className="icon"><SVGIcons type="NEW_CHAT"/></div>
			</div> : false}
			{view.view === 'SETTINGS' ?  <div className="top"><h1>Settings</h1></div> : false}
			{view.view === 'CHATS' || view.view === 'CHAT' ? <SearchBar onSearch={this.onSearch.bind(this)}></SearchBar> : false}
		</header>
	}

	renderViewChatList ()
	{
		return <div data-view={"CHATS"} className={'view'+(this.state.activeChatCard ? ' hide' : '')}>
			{this.renderViewHeader()}
			{this.renderChatList('')}
		</div>
	}

	renderViewSettings ()
	{
		return <div data-view={"SETTINGS"}className="view">
			{this.renderViewHeader()}
			{<SettingsContent changeSlideInView={this.changeSlideInView.bind(this)} changeToast={this.props.changeToast.bind(this)}></SettingsContent>}
		</div>
	}

	renderSettingsSlideIn ()
	{
		return <SettingsSlideIn changeSlideInView={this.changeSlideInView.bind(this)} changeToast={this.props.changeToast.bind(this)} deferredInstallPrompt={this.props.deferredInstallPrompt} onClose={this.onCloseSlideIn.bind(this,() => this.setState({slideInView:false}) )}/>
	}

	onCloseSlideIn (trigger)
	{
		trigger();
	}

	renderChooseChatsSlideIn ()
	{
		let props = {
			onSendMsg:this.onSendMsg.bind(this),
			removeFilePreview:this.removeFilePreview.bind(this),
			onFileReady:this.onFileReady.bind(this),
			onClose:this.onCloseSlideIn.bind(this,() => this.setState({chooseChatsActive:!this.state.chooseChatsActive}) ),
			changeToast:this.props.changeToast.bind(this),
			user:this.props.user
		};
		return <ChooseChatsSlideIn  {...props}/>
	}

	removeFilePreview ()
	{
		this.setState({slideInView:false});
		this.props.removeFilePreview();
	}

	renderNewChatsSlideIn ()
	{
		return <NewChatSlideIn onClose={this.onCloseSlideIn.bind(this,() => this.setState({slideInView:false}) )} changeToast={this.props.changeToast.bind(this)}/>
	}

	renderChangeProfileImageSlideIn ()
	{
		let onCloseSlideIn = (img) => {
			this.setState({slideInView:false});
			let { user } = this.props;
			user.img = img
			this.props.changeUser(user);
		};
		return <ChangeProfileImageSlideIn user={this.props.user} onClose={onCloseSlideIn.bind(this)} changeToast={this.props.changeToast.bind(this)}></ChangeProfileImageSlideIn>
	}

	changeSlideInView (key)
	{
		console.info('changeSlideInView',key);
		//this.setState({slideInView:this.slideInViewProvider(key)})
		this.setState({slideInView:key})
	}

	slideInViewProvider (key)
	{
		if (key === 'SettingsSlideIn')
		{
			return this.renderSettingsSlideIn()
		}
		if (key === 'ChooseChatsSlideIn')
		{
			return this.renderChooseChatsSlideIn()
		}
		if (key === 'NewChatSlideIn')
		{
			return this.renderNewChatsSlideIn()
		}
		if (key === 'ChangeProfileImageSlideIn')
		{
			return this.renderChangeProfileImageSlideIn()
		}
	}

	canShowCustomInstallPopup ()
	{
		//return true;
		return navigator.userAgent.toLowerCase().indexOf('iphone') !== -1 && !localStorage.getItem('didShowInstallPopup') && !this.state.hideCustomInstallPopup && !window.helper.isAppInstalled()
	}

	onClickCustomInstallPopup ()
	{
		//console.log('onClickCustomInstallPopup');
	   localStorage.setItem('didShowInstallPopup',1);
	   this.setState({hideCustomInstallPopup:true});
	}

	renderMobileView ()
	{
		let { view } = this.props;
		return <div data-profileactive={this.state.profileActive ? 1 : 0} className="wrapper">
			{<div className="content">
				{this.slideInViewProvider(this.state.slideInView)}
				{view.view === 'CHATS' || view.view === 'CHAT' ? this.renderViewChatList() : false}
				{view.view === 'CHAT'  ? this.renderViewChat() : false}
				{view.view === 'SETTINGS' ? this.renderViewSettings() : false}
				{this.state.profileActive  ? this.renderProfile() : false}
			</div>}
			{this.renderMobileMenu()}
			{this.canShowCustomInstallPopup() ? <Popup onClick={this.onClickCustomInstallPopup.bind(this)} className={["pwaInstall"]} text={<span>To install this App click <SVGIcons type={"IOS_SHARE"}></SVGIcons> and then "Add to Home Screen".</span>}/> : false}
		</div>
	}

	renderDesktopView ()
	{
		return <div data-profileactive={this.state.profileActive ? 1 : 0} className="wrapper">
			<SideBar
				onActiveChatChanged={this.onActiveChatChanged.bind(this)}
				onOpenProfile={this.onOpenMyProfile.bind(this)}
				toggleFullScreen={this.props.toggleFullScreen}
				toggle={this.state.toggle}
				mobileToggle={this.mobileToggle}
				user={this.props.user}
				changeSlideInView={this.changeSlideInView.bind(this)}
				slideInView={this.state.slideInView}
				removeFilePreview={this.removeFilePreview.bind(this)}
				changeToast={this.props.changeToast.bind(this)}
			>
			</SideBar>
			{this.state.activeChatCard  ? this.renderViewChat() : this.renderNoActiveChat()}
			{this.state.profileActive  ? this.renderProfile() : false}
		</div>
	}

	renderFilePreview (file,index)
	{
		let fileEl = null;
		if (file.type.indexOf('image/') !== -1)
		{
			fileEl = <img src={(file.binary)}/>
		}
		if (file.type.indexOf('audio/') !== -1)
		{
			fileEl = <audio controls src={file.binary}/>
		}
		if (file.type.indexOf('video/') !== -1)
		{
			fileEl = <video controls src={file.binary}/>
		}
		return <div key={'filePreview_'+index} className="file">
			{fileEl}
		</div>
	}

	renderShareFilesPreview ()
	{
		return this.state.sharedFiles && this.state.sharedFiles.length ? <div className="sharedFilesPreview">

			<div className="cont">
				{/*this.props.sharedFiles ? this.props.sharedFiles.map(this.renderFilePreview.bind(this)) : false*/}
				{this.renderChatList('SHARE')}
				<div className="btns">

					<div onClick={this.removeFilePreview.bind(this)} className="def-btn">Abort</div>
					<div className="def-btn">Import</div>
				</div>

			</div>
		</div> : false
	}

	renderProfile ()
	{
		return this.state.profileActive ? <ProfileSlideIn chat={this.state.activeChatCard} noAnimation={window.helper.isMobileView() ? false : true} onClose={this.onCloseSlideIn.bind(this,() => this.setState({profileActive:!this.state.profileActive}) )}/> : false
	}

	render() {

		return (
			<div className="chatMainContainer">
				{window.helper.isMobileView() ? this.renderMobileView() : this.renderDesktopView()}
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
	changeView: function (data)
	{
		return dispatch(changeView(data));
	},
	changeModal: function (data)
	{
		return dispatch(changeModal(data));
	},
});

export default connect(mapStateToProps, mapDispatchToProps,null,{forwardRef: true})(ChatContainer)