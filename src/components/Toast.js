import React, {Component} from "react";
import SVGIcons from "../SVGIcons";
import { changeToast} from "../actions";
import {connect} from "react-redux";

class Toast extends Component {

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
		this.root.current.classList.remove('show');
	}

	componentDidMount()
	{
		//console.log(this);
		this.root.current.addEventListener('transitionend',(e) => {

			//console.log('Trans End',e);
			if (!this.root.current.classList.contains('show'))
			{
				this.setState({active:false});
				if (this.props.onHidden) this.props.onHidden();
				this.props.changeToast(false);
			}
		});
		window.helper.forceReflow(this.root.current);
		this.root.current.classList.add('show');
	}

	render ()
	{
		const { text } = this.props;
		let classNames = ['toast',this.state.active ? 'active' : ''];
		return this.state.active ? <div ref={this.root} className={classNames.join(' ')}>
			<div className="text">{text}</div>
		</div> : false
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Toast);