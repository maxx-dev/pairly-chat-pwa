export default class FetchManager {

    async post (route,opts = {})
    {
        let response = await fetch(route, {
            method: 'post',
            headers: { 'Content-Type': "application/json", 'Token': localStorage.getItem('token') },
            body: JSON.stringify(opts.data)
        });
        //console.log('response',response);
        if (response.status !== 200)
        {
            return ['NOT_ALLOWED',null]
        }
        return [null,await response.json()];
    }

    async put (route,opts = {})
    {
        let response = await fetch(route, {
            method: 'put',
            headers: { 'Content-Type': "application/json", 'Token': localStorage.getItem('token') },
            body: JSON.stringify(opts.data)
        });
        //console.log('response',response);
        if (response.status !== 200)
        {
            return ['NOT_ALLOWED',null]
        }
        return [null,await response.json()];
    }

    async get (route,opts = {})
    {
        let response = await fetch(route, {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'Token': localStorage.getItem('token') },
            body: JSON.stringify(opts.data)
        });
        //console.log('response',response);
        if (response.status !== 200)
        {
            return ['NOT_ALLOWED',null]
        }
        return [null,await response.json()];
    }
}