import React, {Component} from "react";

export default class UserProfileImg extends Component {

	constructor()
	{
		super();
		this.state = {};
		this.img = React.createRef();
	}

	getUserProfileFromApi (s3Key)
	{
		return 'api/media/'+s3Key+'/'+localStorage.getItem('token')
	}

	renderImg ()
	{
		let user = this.props.user;
		let src = user.img;
		if (user.img && user.img.indexOf('profile/') !== -1)
		{
			src = this.getUserProfileFromApi(user.img);
		}
		//console.log('src',src);
		return <img ref={this.img} onError={this.onImgErr.bind(this)} src={src}></img>
	}

	setImg (src)
	{
		this.img.current.src = src;
	}

	onImgErr (e)
	{
		if (this.props.onImgErr) this.props.onImgErr(e);
	}

	render ()
	{
		return this.renderImg()
	}
};
