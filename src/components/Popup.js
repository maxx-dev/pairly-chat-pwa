import React, {Component} from "react";

class Popup extends Component {

	constructor(props)
	{
		super();
		this.state = {
			active:true
		};
		setTimeout(this.onHide.bind(this),props.timeout || 5000);
		this.root = React.createRef();
	}

	onHide ()
	{
		this.root.current ? this.root.current.classList.remove('show') : false;
	}

	componentDidMount()
	{
		this.root.current.addEventListener('transitionend',(e) =>
		{
			if (!this.root.current.classList.contains('show'))
			{
				this.setState({active:false});
				if (this.props.onHidden) this.props.onHidden();
			}
		});
		window.helper.forceReflow(this.root.current);
		this.root.current.classList.add('show');
	}

	onClick ()
	{
		if (this.props.onClick) this.props.onClick(this);
	}

	render ()
	{
		const { text, className } = this.props;
		let classNames = ['popup',this.state.active ? 'active' : '',...className];
		return this.state.active ? <div ref={this.root} onClick={this.onClick.bind(this)} className={classNames.join(' ')}>
			<div className="text">{text}</div>
		</div> : false
	}
}

export default Popup