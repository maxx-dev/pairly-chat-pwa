import React, {Component} from "react";
import ChatCard from "../components/ChatCard";
import SVGIcons from "../SVGIcons";
import Msg from "../components/Msg";
import {changeToast, changeUser, changeView, changeOverlay, changeConnection} from "../actions";
import {connect} from "react-redux";
import Overlay from "../components/Overlay";
import MediaRecorderPolyFill from '../libs/mediaRecorderPolyfill/index'
import Options from "../components/Options";
import Spinner from "../components/Spinner";
//window.MediaRecorderCustom = MediaRecorderPolyFill;

class Chat extends Component {

	constructor(props)
	{
		//console.log('props.user in chat',props.user);
		super();
		this.state = {
			showPlaceHolder:true,
			msg:this.getInitialMsg(),
			firstLoadDone:false,
			msgs:[],
			newMsgReadyMap: {}
		};

		this.ref = {
			root:React.createRef(),
			inp:React.createRef(),
			msgs:React.createRef(),
			scrollToBottom:React.createRef()
		};
		this.listeners = {}
	}

	componentDidMount()
	{
		let chat = this.props.activeChatCard;
		//console.log('didMountChat',chat.userChat.chatId);
		let cacheKey = () => 'cache|chat_'+chat.userChat.chatId;
		window.app.socketManager.on('get:chatMessages',this.onGetChatMsgs.bind(this),{cacheKey: cacheKey()});

		this.listeners.windowFocus = this.onWindowFocus.bind(this);
		this.listeners.socketConnected = this.onSocketConnected.bind(this);
		this.listeners.socketReconnected = this.onSocketReconnected.bind(this);
		window.addEventListener('WindowFocus',this.listeners.windowFocus );
		window.addEventListener('SocketConnected',this.listeners.socketConnected );
		window.addEventListener('SocketReconnected',this.listeners.socketReconnected );
		this.initMediaSession();
		//this.askForMicro()

		if (window.app.socketManager.isConnected())
		{
			this.getChatMsgs();
		}
	}

	componentWillUnmount()
	{
		window.removeEventListener('WindowFocus',this.listeners.windowFocus)
		//window.socket.removeAllListeners('get:chatMessages');
	}

	getChatMsgs ()
	{
		let chat = this.props.activeChatCard;
		let cacheKey = () => 'cache|chat_'+chat.userChat.chatId;
		window.app.socketManager.emit('get:chatMessages',chat.userChat.chatId,{limit:20},{cacheKey:cacheKey()});
	}

	onSocketConnected ()
	{
		//console.log('onSocketConnected');
		this.getChatMsgs();
	}

	onSocketReconnected ()
	{
		let { msgs } = this.state;
		//console.info('onSocketReconnected',msgs);
		if (msgs.length)
		{
			let lastMsg = msgs[msgs.length -1];
			//console.log('lastMsg',lastMsg);
			this.handlePongMsg(lastMsg);
		}
	}

	getInitialMsg ()
	{
		return {text:''}
	}

	onWindowFocus ()
	{
		//console.log('onWindowFocus');
		//this.setAllMessagesRead('onWindowFocus');
	}

	askForMicro ()
	{
		window.app.permissionManager.checkPermissions( {name: 'microphone'}).then((function ([err,granted])
		{
			console.log('checkPermissions',granted)
		}))/**/
	}

	updatePositionState() {
		if (navigator.mediaSession && 'setPositionState' in navigator.mediaSession && this.state.activeMediaElement) {
			console.log('Updating position state...');
			let audio = this.state.activeMediaElement;
			navigator.mediaSession.setPositionState({
				duration: audio.duration,
				playbackRate: audio.playbackRate,
				position: audio.currentTime
			});
		}
	}

	initMediaSession ()
	{
		let defaultSkipTime = 10; /* Time to skip in seconds by default */
		if (!navigator.mediaSession) return;
		navigator.mediaSession.setActionHandler('seekbackward', (e) => {
			//console.log('> User clicked "Seek Backward" icon.');
			const skipTime = e.seekOffset || defaultSkipTime;
			let audio = this.state.activeMediaElement;
			if (audio)
			{
				audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
				this.updatePositionState();
			}
		});

		navigator.mediaSession.setActionHandler('seekforward',(e) => {
			//console.log('> User clicked "Seek Forward" icon.');
			const skipTime = e.seekOffset || defaultSkipTime;
			let audio = this.state.activeMediaElement;
			if (audio)
			{
				audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration);
				this.updatePositionState();
			}
		});

		navigator.mediaSession.setActionHandler('play', async () => {
			//console.log('> User clicked "Play" icon.');
			let audio = this.state.activeMediaElement;
			if (audio)
			{
				await audio.play();
				navigator.mediaSession.playbackState = "playing";
			}
		});

		navigator.mediaSession.setActionHandler('pause', () => {
			//console.log('> User clicked "Pause" icon.');
			let audio = this.state.activeMediaElement;
			if (audio)
			{
				audio.pause();
				navigator.mediaSession.playbackState = "paused";
			}
		});

		/* Stop (supported since Chrome 77) */

		let audio = this.state.activeMediaElement;
		if (audio)
		{
			try {
				navigator.mediaSession.setActionHandler('stop', () => {
					//console.log('> User clicked "Stop" icon.');
				});
			} catch(error) {
				log('Warning! The "stop" media session action is not supported.');
			}

			/* Seek To (supported since Chrome 78) */
			try {
				navigator.mediaSession.setActionHandler('seekto', (e) => {
					//console.log('> User clicked "Seek To" icon.');
					if (e.fastSeek && ('fastSeek' in audio)) {
						audio.fastSeek(e.seekTime);
						return;
					}
					audio.currentTime = e.seekTime;
					this.updatePositionState();
				});
			} catch(error) {
				console.log('Warning! The "seekto" media session action is not supported.');
			}
		}

	}

	onGetChatMsgs (newMsgs)
	{
		let { msgs } = this.state;
		if (newMsgs === 'NOT_IN_CACHE')
		{
			console.info('not in cache');
			return
		}
		console.log('newMsgs',newMsgs.length,newMsgs);
		if (newMsgs.length === 0)
		{
			this.setIsLoadingNewMsgs(false);
			return;
		}
		this.state.newMsgReadyMap = {};
		this.state.latestOldMsg = msgs[0];
		for (let s=0;s<newMsgs.length;s++)
		{
			let msg = newMsgs[s];
			msg.createdAt = new Date(msg.createdAt);
			this.state.newMsgReadyMap[msg.id] = false
		}
		let update = {};
		if (msgs.length !== 0)
		{
			msgs.unshift(...newMsgs);
			update.msgs = msgs;
		}
		else
		{
			update.msgs = newMsgs;
		}
		//console.log('update',update);
		this.setState(update,() =>
		{
			//if (this.scrollRelative <= 0.15) this.canLoadNewMsgs()
			if (window.helper.hasUnreadMsgs(this.state.msgs)) {}
			this.setAllMessagesRead('GetChatMsgs');
			let lastMsg = this.state.msgs[this.state.msgs.length -1];
			//console.log('lastMsg',lastMsg);
			this.handlePongMsg(lastMsg);
		});
	}

	scrollToBottom (animated) {

		let msgs = document.querySelectorAll('.chat .msg');
		if (msgs && msgs.length)
		{
			let last = msgs[msgs.length -1];
			if (animated)
			{
				last.scrollIntoView({ behavior: "smooth" });
				//messagesEnd.current.scrollIntoView({ behavior: "smooth" });
			}
			else
			{
				if (this.ref.msgs.current)
				{
					//let scrollTop =last.offsetTop;
					//console.log('scrollTop',scrollTop);
					//this.scrollTo(scrollTop);
					this.scrollTo(this.ref.msgs.current.scrollHeight - this.ref.msgs.current.getBoundingClientRect().height);
				}
			}
		}
	}

	scrollTo (pos)
	{
		this.ref.msgs.current.scrollTop = pos;
	}

	onChatHeadClick ()
	{
		if (this.props.onOpenProfile) this.props.onOpenProfile();
	}

	onNewMsg (newMsg)
	{
		//console.info('onNewMsg in Chat',newMsg);
		let { msgs } = this.state;
		let found = false;
		for (let s=0;s<msgs.length;s++)
		{
			let msg = msgs[s];
			if (msg.uuid === newMsg.uuid)
			{
				found = true;
				//console.log('Msg Exists',msg);
				msgs[s] = newMsg;
			}
		}
		if (!found)
		{
			msgs.push(newMsg);
		}
		this.state.newMsgReadyMap[newMsg.id] = false;
		this.setState({msgs:msgs},function ()
		{
			//console.log('ScrollToBottom',newMsg.userId,this.props.user.id)
			this.scrollToBottom();
			if (newMsg.userId !== this.props.user.id)
			{
				//this.setAllMessagesRead();
				this.handlePongMsg(newMsg);
			}
		});
	}

	handlePongMsg (msg)
	{
		//console.info('handlePongMsg',msg);
		if (!msg) return;
		if (msg.text === 'PING' && window.app.isBatteryTest)
		{
			this.sendPong(5000);
		}
	}

	sendPong (delay)
	{
		let msg = {type:'TEXT',text:'PONG'};
		setTimeout(() => {
			console.log(new Date().toISOString(),'Sending PONG msg');
			this.onSendMsg(msg);
		},delay)
	}

	onUpdateMsgStatus (msgId,status)
	{
		//console.log('onUpdateMsgStatus',msgId,status);
		let { msgs } = this.state;
		let msg = window.helper.getChatMsgById(msgs,msgId);
		if (msg)
		{
			msg.state = status;
		}
		else
		{
			console.log('Msg with id',msgId,'not found');
		}
		this.setState({msgs:msgs});
	}

	setAllMessagesRead (reason)
	{
		//console.log('setAllMessagesRead',reason);
		let { msgs } = this.state;
		//console.log('msgs',msgs);
		let unreadMessages = window.helper.getUnreadMsgs(msgs);
		unreadMessages = unreadMessages.filter((msg) => msg.userId !== this.props.user.id);
		for (let s=0;s<msgs.length;s++)
		{
			if (msgs[s].userId !== this.props.user.id)
			{
				msgs[s].state = 2;
			}
		}
		//console.log('msgs',msgs);
		//console.log('unreadMessages',unreadMessages.length,unreadMessages);
		if (unreadMessages.length)
		{
			let latestMsg = unreadMessages[unreadMessages.length -1];
			//console.log('latestMsg',latestMsg.id);
			window.app.socketManager.emit('put:messageRead',latestMsg);
			this.setState({msgs:msgs});
		}
		if (this.props.onAllChatMsgsRead) this.props.onAllChatMsgsRead(msgs);
	}

	setPlaceHolder (showPlaceHolder)
	{
		//console.log('setPlaceHolder',showPlaceHolder);
		this.setState({showPlaceHolder:showPlaceHolder});
	}

	onChangeMsg (e)
	{
		let val = e.target.innerHTML;
		if (val === '<br>') val = '';
		//console.log('changeHandler',val);
		this.setPlaceHolder(!!!val);
		this.setState({
			msg: {text:val,userId:this.props.user.id}
		});
		this.props.onChangeMsg(val,this)
	}

	onSendMsg (msg)
	{
		//const { msg } = this.state;
		if(!msg.uuid) msg.uuid = window.helper.uuidv4();
		if(!msg.type) msg.type = 'TEXT';
		if(!msg.userId) msg.userId = this.props.user.id;
		this.setPlaceHolder(true);
		this.props.onSendMsg(msg, {});
		if (!navigator.onLine)
		{
			msg.createdAt = new Date();
			this.onNewMsg(msg);
		}
		//console.log('this.ref.inp',this.ref.inp);
		this.ref.inp.current.innerHTML = '';
	}

	onKeyUp (e)
	{
		const { msg } = this.state;
	}

	onKeyDown (e)
	{
		const { msg } = this.state;
		//console.log('onKeyDown',e.key);
		if (e.key === "Enter" && msg) {
			this.onSendMsg(msg);
			e.preventDefault();
			return false;
		}
	}

	renderDateSeparator (date,msgId)
	{
		let today = new Date();
		let yesterday = new Date();
		yesterday.setDate(yesterday.getDate() -1);
		if (!date || !date.getDate)
		{
			console.error('no valid date',msgId,date);
			return false
		}
		let isToday = window.helper.isSameDay(date,today);
		let isYesterday = window.helper.isSameDay(date,yesterday);
		let txt = window.helper.pad(date.getDate())+'.'+window.helper.pad(date.getMonth() +1)+'.'+date.getFullYear();
		if (isToday) txt = 'Today';
		if (isYesterday) txt = 'Yesterday';
		return <div key={'dateSeparator_'+date.getTime()} className="dateSeparator">
			<div className="content">
				<div className="textCont">
					<span>{txt}</span>
				</div>
			</div>
		</div>
	}

	onScrollMsgs (e)
	{
		let scrollMax = e.target.scrollHeight - e.target.getBoundingClientRect().height;
		this.scrollRelative = e.target.scrollTop / scrollMax;
		//console.log('onScroll',e.target.scrollTop,scrollMax,'scrollRelative',this.scrollRelative);
		if (this.ref.scrollToBottom && this.ref.scrollToBottom.current)
		{
			if (this.scrollRelative <= 0.93)
			{
				if (!this.ref.scrollToBottom.current.classList.contains('show')) this.ref.scrollToBottom.current.classList.add('show');
			}
			else
			{
				if (this.ref.scrollToBottom.current.classList.contains('show')) this.ref.scrollToBottom.current.classList.remove('show');
			}
		}

		if (this.scrollRelative <= 0.05)
		//if (this.scrollRelative <= 0)
		{
			//console.log('onScroll',e.target.scrollTop,scrollMax,'scrollRelative',this.scrollRelative,"queryForNewMsgs",this.state.queryForNewMsgs);
			this.canLoadNewMsgs()
		}
	}

	canLoadNewMsgs ()
	{
		let oldestMsg = this.state.msgs[0];
		if(!this.state.queryForNewMsgs)
		{
			let firstMsg = this.state.msgs[0];
			if (!firstMsg.isFirst && navigator.onLine)
			{
				//console.log('Query For new msgs',this.scrollRelative);
				this.state.queryForNewMsgs = true;
				this.ref.msgs.current.style.pointerEvents = 'none';
				this.setState({queryForNewMsgs:true});
				window.app.socketManager.emit('get:chatMessages',this.props.activeChatCard.userChat.chatId,{to:oldestMsg.createdAt,limit:15});
			}
			else
			{
				//console.log('Start of Chat reached');
			}
		}
		else
		{

		}
	}

	activeMediaElementChanged (activeMediaElement)
	{
		this.setState({activeMediaElement:activeMediaElement});
	}

	renderMsg (msg,classNames)
	{
		//console.log('msg',msg);
		//console.log(this.props.user);
		return <Msg onReady={this.onMsgReady.bind(this)} activeMediaElementChanged={this.activeMediaElementChanged.bind(this)} key={'msg_'+msg.uuid} msg={msg} chat={this.props.activeChatCard} user={this.props.user} classNames={classNames}></Msg>
	}

	onMsgReady (msg)
	{
		if (!this.msgReadyCount) this.msgReadyCount = 0;
		//console.log('onMsgReady',msg.props.msg.id,this.state.newMsgReadyMap);
		this.msgReadyCount++;
		if (this.state.newMsgReadyMap[msg.props.msg.id])
		{
			this.state.newMsgReadyMap[msg.props.msg.id] = true;
		}
		if (this.state.newMsgReadyMap[msg.props.msg.id] === undefined)
		{
			console.log('Msg with id',msg.props.msg.id,'not in newMsgReadyMap');
		}
		if (this.msgReadyCount === this.state.msgs.length -1)
		{
			if (!this.state.firstLoadDone)
			{
				//console.log('scrollToBottom on init');
				this.scrollToBottom(false);
			}
			this.setState({firstLoadDone:true});
		}

		if (this.allNewMsgsReady()) // wait until all new msgs have reported to be ready via onReady event
		{
			if (this.state.latestOldMsg)
			{
				//console.log('All new Msgs Ready',this.state.latestOldMsg.id);
				if (this.getMsgElementById(this.state.latestOldMsg.id))
				{
					let newScrollTop = this.getMsgElementById(this.state.latestOldMsg.id).offsetTop - 20;
					this.scrollTo(newScrollTop);
					//console.log('latestOldMsg =>',newScrollTop);
					setTimeout(() => {
						this.scrollTo(newScrollTop);
						this.setIsLoadingNewMsgs(true)
					},600) // Stupid Mobile safari is not able to set scrollPosition directly after new elements are being rendered
				}
			}
		}
	}

	setIsLoadingNewMsgs (state)
	{
		this.ref.msgs.current.style.pointerEvents = state ? 'none' : 'auto';
		this.setState({queryForNewMsgs:state});
	}

	getMsgElementById (id)
	{
		return  document.querySelector('.msg[data-id="'+id+'"]');
	}

	allNewMsgsReady ()
	{
		let notReady = [];
		for (let msgId in this.state.newMsgReadyMap)
		{
			let msg = this.state.newMsgReadyMap[msgId];
			if (!msg)
			{
				notReady.push(msgId)
			}
		}
		//console.log('newMsgReadyMap',this.state.newMsgReadyMap);
		if (notReady.length === 0) return true;
		return false;
	}

	renderMsgLoader ()
	{
		// _3L1tY
		return <div className="loaderContainer">
			<div className="loader">
				{/*<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M17.6 6.4C16.2 4.9 14.2 4 12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8c3.7 0 6.8-2.6 7.7-6h-2.1c-.8 2.3-3 4-5.6 4-3.3 0-6-2.7-6-6s2.7-6 6-6c1.7 0 3.1.7 4.2 1.8L13 11h7V4l-2.4 2.4z"></path></svg>*/}
				<svg className="_29XkV" width="24" height="24" viewBox="0 0 46 46"><circle className="" cx="23" cy="23" r="20" fill="none" strokeWidth="6"></circle></svg>
		</div>
		</div>
	}

	renderSendBtn ()
	{
		let renderRecordAudio = () => {

			return this.state.recordAudio ? <div className="sendAudioCont">
				<SVGIcons onClick={this.stopRecordAudio.bind(this)} className={"close"} type={'CLOSE_CIRCLE'}/>
				<div className="duration"></div>
				<SVGIcons onClick={this.sendAudio.bind(this)} className="check" type={'CLOSE_CHECK'}/>
			</div> : <SVGIcons className="micro" onClick={this.startRecordAudio.bind(this)} type={'MICRO'}/>

		};
		//console.log('this.state.recordAudio',this.state.recordAudio);
		return this.state.showPlaceHolder ? renderRecordAudio() : <div onClick={this.onClickSendMsg.bind(this)}><SVGIcons className="send" type={'SEND'}/></div>;
	}

	startRecordAudio (e)
	{
		window.app.permissionManager.checkPermissions({name:'microphone'}).then( ([err,granted]) => {

			if (err) console.error(err);
			console.log('microphone',granted)
			if (granted)
			{
				console.log('startRecordAudio');
				this.startGetUserMediaAudio();
			}
			else
			{
				this.props.changeOverlay(<Overlay overlay={{headline:'Allow Microphone',text:'Do send voice messages, please klick on "Allow" to give Pairly access to record audio.',btn:{text:'I understand',onClick:this.onConfirmPermissionOverlay.bind(this)}}}/>);
				this.startGetUserMediaAudio();
			}
		})
	}

	onConfirmPermissionOverlay ()
	{
		this.props.changeOverlay(false);
	}

	startGetUserMediaAudio ()
	{
		const audioChunks = [];
		navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
			console.log('Start Stream',stream);
			this.setState({recordAudio:true, audioStartedAt: new Date()}, () => {
				this.audioRecordInterval = setInterval(()=> {
					let now = new Date();
					if (this.state.audioStartedAt)
					{
						let duration = now.getTime() - this.state.audioStartedAt.getTime();
						let durationLabel = document.querySelector('.sendAudioCont .duration');
						if (durationLabel)
						{
							durationLabel.innerHTML = window.helper.userFormatDurationFromMs(duration);
						}
					}
				},200)
				//let mimeType = 'audio/webm;codecs=opus';
				let mimeType = 'audio/wav';
				this.mediaRecorder = new MediaRecorderCustom(stream,{});
				this.stream = stream;
				this.mediaRecorder.start();
				this.mediaRecorder.addEventListener('dataavailable', e => {
					console.log('chunk',this.mediaRecorder.state,this.mediaRecorder.send,e);
					audioChunks.push(e.data);
					this.state.audioChunks = audioChunks;
					if (this.mediaRecorder.state === "inactive" && this.mediaRecorder.send)
					{
						this.state.msg.mimeType = mimeType;
						let blob = new Blob(audioChunks,{type:mimeType});
						let msg = {type:'AUDIO',uuid:window.helper.uuidv4()};
						this.onSendMsg(msg);
						if (this.props.onFileReady) this.props.onFileReady(blob,msg.uuid);
					}
				})
			});
		});
	}

	stopRecordAudio ()
	{
		console.log('stopRecordAudio');
		if (this.mediaRecorder) this.mediaRecorder.stop();
		if (this.stream) this.stream.getTracks().forEach(track => track.stop());
		if (this.audioRecordInterval) clearInterval(this.audioRecordInterval);
		this.setState({recordAudio:false, audioStartedAt:null});
	}

	sendAudio ()
	{
		let { msg } = this.state;
		this.mediaRecorder.send = true;
		this.stopRecordAudio();
		msg.type = 'AUDIO';
		//this.onSendMsg(msg)
	}

	onClickSendMsg ()
	{
		const { msg, msgs } = this.state;
		if (msg.text) {
			this.onSendMsg(msg);
			this.scrollToBottom();
		}
	}

	onClickBack ()
	{
		//console.log('onClickBack');
		this.props.onActiveChatChanged(false,false);
	}


	onShowShareOptions ()
	{
		this.setState({showShareOptions:!this.state.showShareOptions});
	}

	onChooseShareOption (option)
	{
		console.log('onChooseShareOption',option);
		if (option.key === 'LOCATION')
		{
			navigator.geolocation.getCurrentPosition((position) => {
				if (position)
				{
					console.log('position',position.coords.latitude,position.coords.longitude,position);
					let msg = {};
					msg.type = 'LOCATION';
					msg.metaData = {lat:position.coords.latitude,lng:position.coords.longitude,accuracy:position.coords.accuracy,altitude:position.coords.altitude};
					this.onSendMsg(msg);
				}
			});
		}
		if (option.key === 'DOCUMENT')
		{
			//return;
		}
		this.setState({showShareOptions:false});
	}

	onOpenProfile ()
	{
		if (this.props.onOpenProfile) this.props.onOpenProfile();
	}

	canDoDragAndDropUpload () {
		const div = document.createElement('div');
		return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
	}

	onDragEventInit (e)
	{
		if (!this.ref.root.current.classList.contains('dragMove'))
		{
			console.log('Add');
			this.ref.root.current.classList.add('dragMove');
		}
	}

	onDragEvent (e)
	{
		e.preventDefault();
		e.stopPropagation();
		if (e.type !== 'dragover')
		{
			console.log(e.type,e,);
		}

		let remove = () => {
			if (this.ref.root.current.classList.contains('dragMove'))
			{
				console.log('Remove');
				this.ref.root.current.classList.remove('dragMove');
			}
		};
		if (e.type === 'dragleave')
		{
			remove();
		}
		if (e.type === 'drop')
		{
			remove();
			let dt = e.dataTransfer;
			let files = dt.files;
			console.log('files',files);
			for (let s=0;s<files.length;s++)
			{
				let file = files[s];
				this.onHandleFile(file);
			}
		}
	}

	onFileChange (e)
	{
		console.log('onFileChange',e);
		let files = e.target.files;
		for (let s=0;s<files.length;s++)
		{
			let file = files[s];
			this.onHandleFile(file);
		}
		this.setState({showShareOptions:false});
	}

	onHandleFile (file)
	{
		let msg = window.app.msgBuilder.prepareFileMsg(file);
		if (this.props.onFileReady) this.props.onFileReady(file,msg.uuid);
		this.onSendMsg(msg);
	}

	onMouseDownMsgsCont (e)
	{
		//console.log('onMouseDownMsgsCont',e);
		if (document.activeElement && document.activeElement.getAttribute('name') === 'message')
		{
			document.activeElement.blur()
		}
	}

	render ()
	{
		const { msg, msgs, firstLoadDone, queryForNewMsgs } = this.state;

		let lastDate = null;
		let chatMessages = [];
		for (let s=0;s<msgs.length;s++)
		{
		    let msg = msgs[s];
			//console.log('msg',this.props.user.id,msg.id);
			let classNames = ['msg'];
			if (this.props.user.id === msg.userId)
			{
				classNames.push('out');
			}
			else
			{
				classNames.push('in');
			}

			let didDateChange = !!(!lastDate || !window.helper.isSameDay(lastDate,msg.createdAt));
			//console.log('didDateChange',lastDate,msg.createdAt);
			if (didDateChange)
			{
				chatMessages.push(this.renderDateSeparator(msg.createdAt,msg.id))
			}
			lastDate = new Date(msg.createdAt.getTime());
			chatMessages.push(this.renderMsg(msg,classNames));
		}
		//console.log('chatMessages',chatMessages.length)
		let props = {
			ref:this.ref.root
		};
		let dropMaskProps = {};
		if (this.canDoDragAndDropUpload())
		{
			props.onDragOver = this.onDragEventInit.bind(this);
			dropMaskProps.onDragEnter = this.onDragEvent.bind(this);
			dropMaskProps.onDragLeave = this.onDragEvent.bind(this);
			dropMaskProps.onDragOver = this.onDragEvent.bind(this);
			dropMaskProps.onDrop = this.onDragEvent.bind(this);
		}
		return <div {...props} className="chat">

				<div {...dropMaskProps} className="dropMask"></div>
				<header data-noselect="1" className="chatHeader">
					<ChatCard onClickBack={this.onClickBack.bind(this)} view={"HEADER"} user={this.props.user} onClick={this.onChatHeadClick.bind(this)} chat={this.props.activeChatCard ? this.props.activeChatCard : false}></ChatCard>
				</header>
				<div onMouseDown={this.onMouseDownMsgsCont.bind(this)} className="msgsContainer">
					{!this.props.connection ? <div className="offlineIndicator">You are offline. Your created messages will be sent when back online!</div> : false}
					<img src={this.props.image} />
					{queryForNewMsgs ? this.renderMsgLoader() : false}
					<div onScroll={this.onScrollMsgs.bind(this)} ref={this.ref.msgs} className="msgs">
						{/*queryForNewMsgs || true ? <Spinner></Spinner> : false*/}
						{chatMessages}
					</div>
					<div className="spacer"/>
					<div onClick={this.scrollToBottom.bind(this,true)} ref={this.ref.scrollToBottom} className="scrollToBottom">
						<span><SVGIcons type="ARROW_DOWN"/></span>
					</div>
					{this.state.showShareOptions ? <div onClick={this.onChooseShareOption.bind(this,false)} className="overlay shareOptions"></div> : false}
				</div>


				<footer className="">
					<div className="wrapper">
					<div onClick={this.onShowShareOptions.bind(this)} className="btn share">
						<SVGIcons type={"PLUS"} />
					</div>
					<div className={this.state.recordAudio ? 'disabled input' : 'input'}>
						{this.state.showPlaceHolder ? <div className="placeholder">Write a message</div> : false}
						<div contentEditable={this.state.recordAudio ? false : true}
							 autoFocus={true}
							 onKeyPress={(e) => {
							 	 //console.log('onKeyPress',e.key,msg);
							 }}
							 onKeyUpCapture={this.onKeyUp.bind(this)}
							 onKeyDown={this.onKeyDown.bind(this)}
							 name="message"
							 ref={this.ref.inp}
							 tabIndex="0"
							 onKeyUp={this.onChangeMsg.bind(this)}
						></div>
					</div>
					<div className="btn send">
						<div className="btnWrapper">{this.renderSendBtn()}</div>
					</div>
					</div>
				</footer>

				{this.state.showShareOptions ? <Options onFileChange={this.onFileChange.bind(this)} onChooseOption={this.onChooseShareOption.bind(this)} options={[{key:'LOCATION',icon:'LOCATION',title:'Location'},{key:'DOCUMENT',icon:'DOCUMENT',title:'Document'},{key:'ABORT',icon:'',title:'Abort'}]}></Options> : false}
			</div>
	}


};

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
	changeOverlay: function (view)
	{
		return dispatch(changeOverlay(view));
	},
	changeConnection: function (data)
	{
		return dispatch(changeConnection(data));
	},
});

export default connect(mapStateToProps, mapDispatchToProps,null,{forwardRef: true})(Chat);
//export default Chat
