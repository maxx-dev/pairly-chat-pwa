import React, {Component} from "react";
import SVGIcons from "../SVGIcons";

export default class Msg extends Component {

	constructor()
	{
		super();
		this.state = {

		};

		this.map = React.createRef();
		this.listeners = {};
	}

	componentDidMount()
	{
		const { msg, classNames, chat, user } = this.props;
		if (msg.type === 'LOCATION') this.setMarker();
		if (msg.type !== 'AUDIO' && msg.type !== 'VIDEO' && msg.type !== 'IMAGE')
		{
			this.onReady();
		}
	}
	componentWillUnmount()
	{
		window.removeEventListener('GoogleMapsReady',this.listeners.mapsReady);
	}

	onMapsReady ()
	{
		const { msg } = this.props;
		if (msg.type === 'LOCATION') this.setMarker();
	}

	setMarker ()
	{
		if (!navigator.onLine)
		{
			this.map.current.innerHTML = `<label class="">Maps needs a working connection</label>`
		}
		if (!('google' in window))
		{
			//console.log('Maps API not ready');
			this.listeners.mapsReady = this.onMapsReady.bind(this);
			window.addEventListener('GoogleMapsReady',this.listeners.mapsReady);
			return
		}
		const { msg, classNames, chat, user } = this.props;
		//console.log('msg',msg);
		let loc = {lat: parseFloat(msg.metaData.lat), lng: parseFloat(msg.metaData.lng)};
		let map = new google.maps.Map(this.map.current, {zoom: 4, center: loc});
		let marker = new google.maps.Marker({position: loc, map: map})
	}

	renderStatus ()
	{
		if (window.app.isMockup) return false;
		const { msg, classNames, chat, user } = this.props;
		//console.log('msg',msg,user.id)
		if (msg.userId !== user.id) return false;
		return <span className="status">
			{msg.state === 0 ? <SVGIcons type="SINGLE_CHECK"/> : false}
			{msg.state === 1 ? <SVGIcons type="DOUBLE_CHECK"/> : false}
			{msg.state === 2 ? <SVGIcons type="DOUBLE_CHECK"/> : false}
			{!msg.id ? <SVGIcons type="CLOCK"/> : false}
		</span>
	}

	onReady ()
	{
		if (this.props.onReady) this.props.onReady(this);
	}

	onClickMediaElement ()
	{
		//console.log('onClickMediaElement');
		this.shareMedia();
	}

	shareMedia ()
	{
		const { msg } = this.props;
		if (!navigator.canShare || !navigator.canShare) return;
		let url = this.getMsgFileFromApi(msg);
		//console.log('fetch',url);
		fetch(url+'?link=1').then((response) => response.json()).then(function(res)
		{
			//console.log('res',res);
			fetch(res.url).then((response) => response.blob()).then(function (blob)
			{
				//console.log('blob', blob);
				let file = new File([blob], "picture.jpg", {type: 'image/jpeg'});
				let filesArray = [file];
				if (navigator.canShare && navigator.canShare({files: filesArray}))
				{
					navigator.share({
						text: 'Image',
						files: filesArray,
						title: 'Image',
						url: res.url
					});
				}
			})
		})
	}

	onPlay (e)
	{
		const { msg, classNames, chat, user } = this.props;
		//console.log('onPlay',e,'chat',chat);
		let mediaData = {
			title: 'Nachricht vom '+window.helper.defaultDateTimeStr(msg.createdAt),
			artist: chat.user.firstName+' '+chat.user.lastName,
			album: '-',
			artwork: [
				{ src: chat.user.img,  sizes: '96x96',   type: 'image/png' },
				{ src: chat.user.img,  sizes: '128x128',   type: 'image/png' },
				{ src: chat.user.img,  sizes: '192x192',   type: 'image/png' },
				{ src: chat.user.img,  sizes: '256x256',   type: 'image/png' },
				{ src: chat.user.img,  sizes: '384x384',   type: 'image/png' },
				{ src: chat.user.img,  sizes: '512x512',   type: 'image/png' }
			]
		}
		//console.log('mediaData',mediaData);
		if ('MediaMetadata' in window)
		{
			navigator.mediaSession.metadata = new MediaMetadata(mediaData);
		}
		this.props.activeMediaElementChanged(e.target)
	}

	renderContent ()
	{
		const { msg, classNames, chat, user } = this.props;
		if (msg.type === 'LOCATION')
		{
			return <div className="content">
				<div ref={this.map} className="map"></div>
			</div>
		}
		else if (msg.type === 'AUDIO')
		{
			return <div className="content"><audio onError={this.onReady.bind(this)} onCanPlayThrough={this.onReady.bind(this)} onPlaying={this.onPlay.bind(this)} preload="auto" controls src={this.getMsgFileFromApi(msg)}></audio></div>
		}
		else if (msg.type === 'IMAGE')
		{
			return <div className="content">
				<img onClick={this.onClickMediaElement.bind(this)} onError={this.onReady.bind(this)} onLoad={this.onReady.bind(this)} src={this.getMsgFileFromApi(msg)}/>
			</div>
		}
		else if (msg.type === 'VIDEO')
		{
			return <div className="content">
				<video onError={this.onReady.bind(this)} onLoadedMetadata={this.onReady.bind(this)} controls src={this.getMsgFileFromApi(msg)}/>
			</div>
		}

		return <div className="content"><span className="textCont">{msg.text}</span></div>

	}

	getMsgFileFromApi (msg)
	{
		return 'api/media/'+msg.text+'/'+localStorage.getItem('token')
	}

	render ()
	{
		const { msg, classNames, chat, user } = this.props;
		let humanReadableTimestamp = window.helper.pad(msg.createdAt.getHours()) + ":" + window.helper.pad(msg.createdAt.getMinutes());
		return <div data-type={msg.type} data-id={msg.id} data-createdat={msg.createdAt.toISOString()} data-state={msg.state} key={msg.uuid} className={classNames.join(' ')}>
			<div className="aligner">
			<div className="wrapper">
				<span className="tail">
					{user.id === msg.userId ? <SVGIcons type={'TAIL_OUT'}/> : false}
					{user.id !== msg.userId ? <SVGIcons type={'TAIL_IN'}/> : false}
				</span>
				{user.id !== msg.userId ? <div className="username">
					<span className="textCont">{chat.user.firstName}</span><span>&nbsp;</span><span className={"textCont"}>{chat.user.lastName}</span>
				</div> : false}
				{this.renderContent()}
				<br/>
				<div className="bottom">
					<span className="time "><span className="textCont">{humanReadableTimestamp}</span></span>
					{this.renderStatus()}
				</div>
			</div>
			</div>

		</div>
	}


};

//export default ChatRoom;
