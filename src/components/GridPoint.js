import React, { Component } from 'react';

import Rnd from "react-rnd";

class GridPoint extends Component {

    constructor(props) {
        super(props);


        var radius = props.radius;
        var diameter = radius * 2;

        // edit these to change the grabbable zone
        var rndSize = {
            width: diameter,
            height: diameter
        };

        this.state = {
            position: {
                x: props.position.x,
                y: props.position.y
            },
            radius,
            rndSize,
            disableDragging: props.disableDragging
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        var positionIsSame = this.props.position.x === nextProps.position.x && this.props.position.y === nextProps.position.y;
        var radiusIsSame = this.props.radius === nextProps.radius;
        return !(positionIsSame && radiusIsSame);
    }

    render() {

        var diameter = this.state.radius * 2;

        var rndSize = this.state.rndSize;

        var leftOffset = ((rndSize.width - diameter) / 2);
        var topOffset = ((rndSize.height - diameter) / 2);

        var pointStyle = {
            position: "absolute",
            //left: this.state.position.x + "px",
            //top: this.state.position.y + "px",
            borderRadius: "50%",
            backgroundColor: "black",
            width: diameter + "px",
            height: diameter + "px",
            cursor: "move",
            opacity: 1,
            top:  topOffset + "px",
            left: leftOffset + "px"
        };

        var rndStyle = {
            marginLeft: "-" + leftOffset + "px",
            marginTop: "-" + topOffset + "px"
        };

        var defaults = Object.assign({}, this.state.position, rndSize);

        return (
            <Rnd
                    default={defaults}
                    position={this.props.position}
                    enableResizing={false}
                    onDrag={this.props.onDrag}
                    parent=".container"
                    style={rndStyle}
                    disableDragging={this.state.disableDragging}
                >
                <span id={this.props.id} style={pointStyle}></span>
            </Rnd>
            
        );
    }
}

export default GridPoint;
