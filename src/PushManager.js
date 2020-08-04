import React, {Component} from "react";

export default class PushManager extends Component {

	constructor()
	{
		super();
		this.state = {
			isSubscribed:false
		};
	}

	getSubscription()
	{
		return new Promise((resolve, reject) => {
			window.sw.pushManager.getSubscription().then((subscription) =>
			{
				let isSubscribed = !(subscription === null);
				this.updateSubscriptionOnServer(subscription);
				console.log('Push State:',isSubscribed);
				this.state.isSubscribed = isSubscribed;
				resolve(isSubscribed)
			});
		})
	}

	subscribeUser() {

		return new Promise ((resolve) => {

			const applicationServerKey = window.helper.urlB64ToUint8Array(process.env.WEB_PUSH_PUBLIC_KEY);
			window.sw.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: applicationServerKey
			}).then((subscription) =>
			{
				//console.log('User is subscribed',subscription);
				this.updateSubscriptionOnServer(subscription);
				this.state.isSubscribed = true;
				//updateBtn();
				resolve(true)
			})
				.catch((err) => {
					console.log('Failed to subscribe the user: ', err);
					resolve(false)
				});
		})
	}

	unsubscribeUser()
	{
		let sub = null;
		return new Promise((resolve, reject) => {
			window.sw.pushManager.getSubscription().then((subscription)  => {
				if (subscription) {
					sub = subscription;
					return subscription.unsubscribe();
				}
			}).catch((error)  => {
					console.log('Error unsubscribing', error);
					resolve(false);
				})
				.then(() => {
					this.removeSubscriptionOnServer(sub);
					console.log('User is unsubscribed.');
					resolve(true);
					this.state.isSubscribed = false;
				});
		})

	}

	updateSubscriptionOnServer (subscription)
	{
		window.app.socketManager.emit('post:webPush',subscription)
	}

	removeSubscriptionOnServer (subscription)
	{
		window.app.socketManager.emit('delete:webPush',subscription)
	}

	render ()
	{
		return false
	}
};
