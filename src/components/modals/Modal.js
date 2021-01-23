import React, {Component} from "react";

class Modal extends Component {

	constructor(props)
	{
		super();
		this.state = {
			active:true
		};
		this.root = React.createRef();
		this.window = React.createRef();
	}

	componentDidMount()
	{
		this.root.current.addEventListener('transitionend',(e) =>
		{
			if (!this.root.current.classList.contains('active'))
			{
				this.setState({active:false});
				if (this.props.onHidden) this.props.onHidden();
			}
		});
		window.helper.forceReflow(this.root.current);
		this.root.current.classList.add('active');
		this.window.current.style.transform = 'translate3d(0,'+window.innerHeight+'px,0)';
	}

	onClick ()
	{
		if (this.props.onClick) this.props.onClick(this);
	}

	onAction (action)
	{
		if (this.props.onAction) this.props.onAction(this,action);
	}

	render ()
	{
		const { header, content, className, type } = this.props;
		let classNames = ['modal',this.state.active ? 'active' : '',...className];
		return this.state.active ? <div ref={this.root} onClick={this.onClick.bind(this)} className={classNames.join(' ')}>

			<div ref={this.window} className="window">
				<div className="header">{header}</div>
				<div className="content">{content}</div>
				<div className="actions">
					{type === 'CONFIRM' ? <div onClick={this.onAction.bind(this,'ACCEPT')} className={"def-btn"}>{this.props.confirmAcceptTitle}</div> : false }
					{type === 'CONFIRM' ? <div onClick={this.onAction.bind(this,'REJECT')} className={"def-btn"}>{this.props.confirmRejectTitle}</div> : false }
				</div>
			</div>
		</div> : false
	}
}

export default Modal