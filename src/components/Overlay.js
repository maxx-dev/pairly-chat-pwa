import React, {Component} from "react";
import SVGIcons from "../SVGIcons";

export default class Overlay extends Component {

	constructor(props)
	{
		super();
		this.state = {
			active:true
		};
		//setTimeout(this.onHide.bind(this),props.timeout || 5000);
		this.root = React.createRef();
	}

	onHide ()
	{
		//this.root.current.classList.remove('show');
	}

	componentDidMount()
	{
		/*console.log(this);
		this.root.current.addEventListener('transitionend',(e) => {

			//console.log('Trans End',e);
			if (!this.root.current.classList.contains('show'))
			{
				this.setState({active:false})
			}
		});
		window.helper.forceReflow(this.root.current);
		this.root.current.classList.add('show');*/
	}

	render ()
	{
		const { overlay } = this.props;
		let classNames = ['overlay',this.state.active ? 'active' : ''];
		return this.state.active ? <div ref={this.root} className={classNames.join(' ')}>


			<div className="wrapper">
				<div className="cont">

					<div className="icon">
						<SVGIcons type="ARROW_LEFT_TOP"/>
					</div>
					<div className="content">
						<div className="headline">{overlay.headline}</div>
						<div className="text">{overlay.text}</div>
						<div className="btnCont">{overlay.btn ? <div role="button" onClick={overlay.btn.onClick.bind(this)} className="def-btn">{overlay.btn.text}</div> : false}</div>
					</div>
				</div>

			</div>
		</div> : false
	}
};