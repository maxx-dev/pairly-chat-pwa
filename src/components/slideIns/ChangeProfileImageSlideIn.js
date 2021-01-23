import React, { Component } from 'react';
import SlideIn from "./SlideIn";
import Toast from "../Toast";
import UserProfileImg from "../UserProfileImg";

export default class ChangeProfileImageSlideIn extends SlideIn {

    constructor(props) {
        super();
        this.state = {
            disabled:true
        };

        this.root = React.createRef();
        this.input = React.createRef();
        this.userProfileImg = React.createRef();
    }

    componentDidMount()
    {
        super.componentDidMount();
        window.app.socketManager.on('get:signedFileLink', this.onGetSignedFileLink.bind(this));
    }

    dataURItoBlob (dataURI) {
        let binary = atob(dataURI.split(',')[1]);
        let array = [];
        for(let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
    }

    onGetSignedFileLink (err,uploadUrl,s3Key)
    {
        this.state.s3Key = s3Key;
        console.log('onGetSignedFileLink',uploadUrl);
        let blobData = this.dataURItoBlob(this.dataUrl);
        console.log('blobData',blobData);
        window.helper.uploadFile(blobData, uploadUrl, {mimeType: 'image/jpg'},this.onFileUploaded.bind(this), this.onFileUploadProgress.bind(this));
    }

    onFileUploaded ()
    {
        this.props.changeToast(<Toast text={'Image saved'}></Toast>);
        window.app.socketManager.emit("put:users", {img:this.state.s3Key});
        this.props.onClose(this.state.s3Key);
    }

    onFileUploadProgress ()
    {
        console.log('onFileUploadProgress')
    }

    onChange (e)
    {
        this.setState({disabled:false});
        const reader = new FileReader();
        const userProfileImg = this.userProfileImg.current;
        let file;
        reader.onload = e => {
            userProfileImg.setImg(e.target.result);
            userProfileImg.img.current.onload = () => {
                let resized = this.resizeImg(userProfileImg.img.current); // send it to canvas
                this.dataUrl = resized;
                console.log('this.dataUrl',this.dataUrl )
            }
        };
        file = e.target.files[0];
        //console.log('this.dataUrl',this.dataUrl );
        reader.readAsDataURL(file);
    }

    onUpload ()
    {
        if (this.state.disabled) return;
        window.app.socketManager.emit("get:signedFileLink", 'profile/','image/jpg');
    }

    resizeImg (img) {

        let max_width = 150;
        let max_height = 150;
        let canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // calculate the width and height, constraining the proportions
        if (width > height) {
            if (width > max_width) {
                //height *= max_width / width;
                height = Math.round(height *= max_width / width);
                width = max_width;
            }
        } else {
            if (height > max_height) {
                //width *= max_height / height;
                width = Math.round(width *= max_height / height);
                height = max_height;
            }
        }
        canvas.width = width;   // resize the canvas and draw the image data into it
        canvas.height = height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        //preview.appendChild(canvas); // do the actual resized preview
        return canvas.toDataURL("image/jpeg",0.7); // get the data from canvas as 70% JPG (can be also PNG, etc.)
    }

    onImgErr (e)
    {
        this.setState({imgLoadError:true});
        e.target.style.display = 'none';
    }

    render() {
        const { user } = this.props;
        let btnProps = {};
        return <div ref={this.root} className="changeProfileImage slideIn">
                {this.renderHeader('Change Profile Image')}
                <div className="content">
                    <div className="uploadCont">
                        <label htmlFor="file">
                            <UserProfileImg ref={this.userProfileImg} user={user} onImgErr={this.onImgErr.bind(this)}></UserProfileImg>
                        </label>
                        <input accept="image/png, image/jpeg"  ref={this.input} onChange={this.onChange.bind(this)} type="file" id="file"/>
                    </div>
                    {this.state.disabled ? false :<div {...btnProps} onClick={this.onUpload.bind(this)} className="def-btn upload">Save</div> }
                </div>
            </div>
    };
}
