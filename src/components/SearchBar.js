import React, {Component} from "react";
import SVGIcons from "../SVGIcons";

class SearchBar extends Component {

	constructor(props)
	{
		//console.log('props.user in chat',props.user);
		super();
		this.state = {

		};

		this.ref = {

		}
	}

	componentDidMount()
	{
		window.appMetrics['TTI'].setEnd(false,false, true);
	}

	onFocusSearch (e)
	{
		this.setState({searchFocused:true});
	}

	onBlurSearch (e)
	{
		this.setState({searchFocused:false});
	}

	onSearch (e)
	{
		let val = e.target.innerHTML;
		this.setState({search:val});
		if (this.props.onSearch) this.props.onSearch(val);
	}

	canShowPlaceHolder ()
	{
		return !this.state.searchFocused && !this.state.search;
	}

	render ()
	{
		const { searchFocused, search } = this.state;
		const { user, props } = this.props;
		return  <div className="search">
			<div className="wrapper">
				<div className="icon">
					<SVGIcons type={"SEARCH"}/>
				</div>
				{this.canShowPlaceHolder() ? <div className="placeholder">Search...</div> : false}
				<div className="content">
					<div aria-label="search" onKeyUp={this.onSearch.bind(this)} onFocus={this.onFocusSearch.bind(this)} onBlur={this.onBlurSearch.bind(this)} className={searchFocused ? 'input focused' :'input'} contentEditable={true}></div>
				</div>
			</div>
		</div>
	}
}

export default SearchBar
