
export default class MsgBuilder {

    prepareFileMsg (file)
    {
        let msg = {uuid:window.helper.uuidv4()};
        if (file.type.indexOf('image/') !== -1)
        {
            msg.type = 'IMAGE';
        }
        if (file.type.indexOf('video/') !== -1)
        {
            msg.type = 'VIDEO';
        }
        if (file.type.indexOf('audio/') !== -1)
        {
            msg.type = 'AUDIO';
        }
        msg.mimeType = file.type;
        return msg;
    }
}