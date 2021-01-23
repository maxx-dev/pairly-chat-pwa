
let authHelper = {};

let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
// Use a lookup table to find the index.
let lookup = new Uint8Array(256);
for (let i = 0; i < chars.length; i++)
{
    lookup[chars.charCodeAt(i)] = i
}

authHelper.encode = function (arraybuffer) {
    let bytes = new Uint8Array(arraybuffer)

    let i; let len = bytes.length; let base64url = ''

    for (i = 0; i < len; i += 3) {
        base64url += chars[bytes[i] >> 2]
        base64url += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)]
        base64url += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)]
        base64url += chars[bytes[i + 2] & 63]
    }

    if ((len % 3) === 2) {
        base64url = base64url.substring(0, base64url.length - 1)
    } else if (len % 3 === 1) {
        base64url = base64url.substring(0, base64url.length - 2)
    }

    return base64url
}

authHelper.decode = function (base64string) {
    let bufferLength = base64string.length * 0.75

    let len = base64string.length; let i; let p = 0

    let encoded1; let encoded2; let encoded3; let encoded4

    let bytes = new Uint8Array(bufferLength)

    for (i = 0; i < len; i += 4) {
        encoded1 = lookup[base64string.charCodeAt(i)]
        encoded2 = lookup[base64string.charCodeAt(i + 1)]
        encoded3 = lookup[base64string.charCodeAt(i + 2)]
        encoded4 = lookup[base64string.charCodeAt(i + 3)]

        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4)
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2)
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63)
    }

    return bytes.buffer
};

/**
 * Converts PublicKeyCredential into serialised JSON
 * @param  {Object} pubKeyCred
 * @return {Object}            - JSON encoded publicKeyCredential
 */
authHelper.publicKeyCredentialToJSON = (pubKeyCred) =>
{
    if (pubKeyCred instanceof Array)
    {
        let arr = [];
        for (let i of pubKeyCred) { arr.push(authHelper.publicKeyCredentialToJSON(i)) }
        return arr
    }

    if (pubKeyCred instanceof ArrayBuffer)
    {
        return authHelper.encode(pubKeyCred)
    }

    if (pubKeyCred instanceof Object)
    {
        let obj = {};
        for (let key in pubKeyCred)
        {
            obj[key] = authHelper.publicKeyCredentialToJSON(pubKeyCred[key])
        }
        return obj
    }
    return pubKeyCred
}

/**
 * Decodes arrayBuffer required fields.
 * Note: As of now this only works with Touch-ID in Chrome
 * ios14 allows to create credentials successfully but then in credentials.get asks for a security key instead of touch/face-id
 * No resources available to find out why
 */
authHelper.preformatGetAssertReq = function (getAssert)
{
    let { assertion, webAuthResInfo } = getAssert;
    assertion.challenge = authHelper.decode(assertion.challenge)
    for (let allowCred of assertion.allowCredentials) {
        allowCred.id = authHelper.decode(allowCred.id)
    }
    return assertion

    /*let first = webAuthResInfo[0];
    console.log('getAssert',getAssert);
    console.log('credID',authHelper.decode(first.credID));
    console.log('challenge',authHelper.decode(assertion.challenge));
    return {
        //challenge:assertion.challenge,
        challenge:authHelper.decode(assertion.challenge),
        //pubKeyCredParams: [{ type: 'public-key', alg: -7}],
        //challenge:Uint8Array.from("XXXXXX", c => c.charCodeAt(0)),
        authenticatorSelection: { authenticatorAttachment: 'platform'},
        attestation: 'direct',
        timeout: 15000,
        allowCredentials:[
            {
                type:'public-key',
                //id:id,
                id:authHelper.decode(first.credID),
                //id:Uint8Array.from("XXXXXX", c => c.charCodeAt(0)),
                transports:['internal']
            }
        ]
    }*/
}

/** r
 * Decodes arrayBuffer required fields.
 */
authHelper.preformatMakeCredReq = function (user)
{
    const options = {
        publicKey: {
            rp: {
                name: window.location.host
            },
            user: {
                id: Uint8Array.from("XXXXXX", c => c.charCodeAt(0)),
                name: user.email,
                displayName: user.email
            },
            challenge: Uint8Array.from('XXXXXX', c => c.charCodeAt(0)),
            pubKeyCredParams: [{ type: 'public-key', alg: -7}],
            authenticatorSelection: { authenticatorAttachment: 'platform'},
            //authenticatorSelection: { authenticatorAttachment: 'cross-platform'}, // ignores touchid
            attestation: 'direct',
            timeout: 15000
        }
    };
    return options;
    /*return {
        rp:{ name: window.location.host},
        user: {
            id: Uint8Array.from("XXXXXX", c => c.charCodeAt(0)),
            //id: authHelper.decode(makeCredReq.user.id),
            name:'max@modrena.work',
            displayName:'max@modrena.work'
        },
        pubKeyCredParams: [{type: 'public-key', alg: -7}],
        challenge:Uint8Array.from("XXXXXX", c => c.charCodeAt(0)),
        //challenge:authHelper.decode(makeCredReq.challenge),
        //authenticatorSelection: { authenticatorAttachment: 'platform'},
        //attestation: 'direct',
        timeout: 15000
    }*/
}

export default authHelper;
