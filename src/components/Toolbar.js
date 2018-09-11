import React, { Component } from 'react';

import './Toolbar.css';

class Toolbar extends Component {

    constructor(props) {
        super(props);

        this.state = {};

    }


    render() {

        return (
            <div className="Toolbar">
                <img className="logo" src="https://media.licdn.com/dms/image/C560BAQHOp28MJLE5rQ/company-logo_200_200/0?e=2159024400&v=beta&t=98mit5PU1Jy0v5rR7LX2DZx1Qji2JuRYSo7TkLPMdfw" alt="Logo"></img>
                <span className="title">
                    Kura Distortion Correction Tool
                </span>
            </div>
       );
    }
}

export default Toolbar;

