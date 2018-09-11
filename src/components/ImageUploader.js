import React, { Component } from 'react';

import "./ImageUploader.css";


class ImageUploader extends Component {

    constructor(props) {
        super(props);

        this.openFileDialog = this.openFileDialog.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
    }

    openFileDialog() {
        document.getElementById("file-input").click();
    }

    handleFileUpload(event) {
        var input = event.target;
        if (input.files[0]) {

            var props = this.props;
            var reader = new FileReader();
            reader.onload = function (e) {
                props.onImageUploaded(e.target.result);
            }

            reader.readAsDataURL(input.files[0]);

        }
    }

    render() {
        return (
            <div className="ImageUploader">
                <button className="icon" onClick={this.openFileDialog}><img src="/upload-image-icon2-white.png" alt="Upload"></img></button>
                <input id="file-input" type="file" style={{"display": "none"}} onChange={this.handleFileUpload}></input>
            </div>
        );
    }
}

export default ImageUploader;
