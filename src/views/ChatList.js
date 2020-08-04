import React, {Component} from "react";
import ChatCard from "../components/ChatCard";
import {changeToast, changeUser, changeView, changeOverlay} from "../actions";
//import {connect} from "react-redux";

class ChatList extends Component {

	constructor(props)
	{
		//console.log('props.user in chat',props.user);
		super();
		this.state = {
			chatCardComps:[]
		};

		this.ref = {}
		this.root = React.createRef();
	}

	onChartCardClick (chatCard,chat)
	{
		if (chatCard.props.view === 'SHARE')
		{
			chatCard.toggleSelected();
		}
		else
		{
			chatCard.toggleActive();
			this.setActiveChatCard(chatCard,chat);
		}
	}

	getSelectedChats ()
	{
		return this.state.chatCardComps.filter( (comp) => {
			return comp.state.selected
		})
	}

	setActiveChatCard (chatCard,chat)
	{
		if (this.props.onActiveChatChanged) this.props.onActiveChatChanged(chatCard,chat)
	}

	doFilterChat (chat)
	{
		const { search } = this.props;
		//console.log('search',search);
		if (!search || search === '<br>') return false;
		let searchLower = search.toLowerCase();
		if (chat.user.firstName.toLowerCase().indexOf(searchLower) !== -1 ||
			chat.user.lastName.toLowerCase().indexOf(searchLower) !== -1
		)
		{
			return false;
		}
		return true
	}

	onScroll (e)
	{
		//console.log(e.target.scrollTop,e.target.scrollHeight,e);
	}

	chatCardDidMount (chatCard)
	{
		this.state.chatCardComps.push(chatCard);
	}

	render ()
	{
		const { user, props } = this.props;
		let className = ['userList'];
		if (this.props.className) className = className.concat(this.props.className);
		let usersListComps = [];

		for (let s=0;s<user.chats.length;s++)
		{
			let chat = user.chats[s];
			if (!this.doFilterChat(chat))
			{
				usersListComps.push(<ChatCard didMount={this.chatCardDidMount.bind(this)} view={this.props.view} matchingSearchPart={this.props.search ? this.props.search.toLowerCase() : false} onClick={this.onChartCardClick.bind(this)} user={user} key={chat.userChat.id} chat={chat}></ChatCard>)
			}
		}
		return <div ref={this.root} onScroll={this.onScroll.bind(this)} className={className.join(' ')}>
				{usersListComps}
			</div>
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
	changeView: function (view)
	{
		return dispatch(changeView(view));
	},
	changeOverlay: function (view)
	{
		return dispatch(changeOverlay(view));
	},
});

//export default connect(mapStateToProps, mapDispatchToProps,null,{forwardRef: true})(Chat);
export default ChatList
