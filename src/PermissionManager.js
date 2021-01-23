import React, {Component} from "react";

export default class PermissionManager extends Component {

	constructor()
	{
		super();
		this.state = {

		};
	}

	checkPermissions(map)
	{
		return new Promise((resolve, reject) => {

			//console.log('permissions','permissions' in navigator)
			if (!('permissions' in navigator))
			{
				console.log('Permission API not supported')
				resolve([null,true]);
				return;
			}
			// https://w3c.github.io/permissions/#enumdef-permissionname
			navigator.permissions.query(map || {name: 'microphone'}).then((permission) =>
			{
				console.log(" state", permission.state);
				resolve([null,permission.state === 'granted'])
			}).catch((err) => {
				//console.log('Got error :', err);

				if (navigator.userAgent.indexOf('Firefox') !== -1) // FF does not support microphone in permission api
				{
					resolve([null,true])
					return
				}

				resolve([err,null])
			})
		})
	}

	render ()
	{
		return false
	}
};
