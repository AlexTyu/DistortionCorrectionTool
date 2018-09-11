
import React, { Component } from 'react';

import Rnd from "react-rnd";

import "./GridImage.css"


/**
 * The image of the distorted checkerboard.
 * Is a resizable and movable component
 */
class GridImage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            x: props.x,
            y: props.y,
            width: props.width,
            height: props.height
        };

    }


    render() {

        var defaultConfig = {
            x: this.state.x,
            y: this.state.y,
            width: this.state.width,
            height: this.state.height
        };

        return (
            <Rnd
                    className="GridImage box"
                    default={defaultConfig}
                    minWidth={100}
                    minHeight={100}
                    lockAspectRatio={true}
                >
                <img className="image" src={this.props.imageSrc} alt="Distortion Grid"></img>
            </Rnd>
        );
    }
}

export default GridImage;
