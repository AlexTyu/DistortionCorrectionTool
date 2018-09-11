import React, { Component } from 'react';
import './GridOverlay.css';

import Rnd from "react-rnd";

/**
 * The background axis of the editor.
 * Can be moved around and returns an offset to be calculated into the points
 */
class GridOverlay extends Component {

    constructor(props) {
        super(props);

        var width = props.width;
        var height = props.height;

        var editor = {
            width,
            height,
        };

        var grid = {
            width: width * 2,
            height: height * 2
        };

        this.state = {
            //gridDivider: 2
            editor,
            grid,
            offset: {
                x: (grid.width - editor.width) / 2,
                y: (grid.height - editor.height) / 2
            },
            position: {
                x: 0,
                y: 0
            },
            zoom: {
                x: 0,
                y: 0
            }
        };

        this.onDrag = this.onDrag.bind(this);
        this.onWheel = this.onWheel.bind(this);

    }

    onDrag(event, d) {
        var position = {
            x: d.x + this.state.offset.x,
            y: d.y + this.state.offset.y
        };
        this.setState(previousState => {
            var newState = previousState;
            newState.position = position;
            if (this.props.onDrag) this.props.onDrag(position);
            return newState;
        });

    }

    onWheel(event) {
        console.log("GridOverlay onWheel()", Object.assign({}, event));
        event.preventDefault();

        var dY = - event.deltaY / 1000;

        this.setState(previousState => {
            var newState = previousState;
            newState.zoom.x = previousState.zoom.x + dY
            newState.zoom.y = previousState.zoom.y + dY

            if (this.props.onZoom) this.props.onZoom(newState.zoom);

            return newState;
        })

    }

    render() {

        var editor = this.state.editor;
        var grid = this.state.grid;

        var mainAxis = [
            <div style={{width: "5px", height: "100%", left: "50%"}} className="axis"></div>,
            <div style={{width: "100%", height: "5px", top: "50%"}} className="axis"></div>
        ]


        var zoom = this.props.zoom || this.state.zoom;
        var minDim = Math.min(editor.width, editor.height);
        var zoomOffset = {
            x: Math.pow(2, zoom.x) * (minDim / 4),
            y: Math.pow(2, zoom.y) * (minDim / 4)
        }

        var leftOffset = (grid.width / 2);
        var topOffset = (grid.height / 2);

        var lineWidth = 1;
        var onesAxis = [
            <div style={{width: lineWidth, height: "100%", left: leftOffset - zoomOffset.x}} className="axis"></div>,
            <div style={{width: "100%", height: lineWidth, top: topOffset - zoomOffset.y}} className="axis"></div>,
            <div style={{width: lineWidth, height: "100%", left: leftOffset + zoomOffset.x}} className="axis"></div>,
            <div style={{width: "100%", height: lineWidth, top: topOffset + zoomOffset.y}} className="axis"></div>
        ];

        return (
            <Rnd
                    className="GridOverlay"
                    default={{x: -editor.width / 2, y: -editor.height / 2}}
                    enableResizing={false}
                    size={{width: grid.width, height: grid.height}}
                    onDrag={this.onDrag}
                    extendsProps={{onWheel: this.onWheel}}
                >
                {mainAxis}
                {onesAxis}
            </Rnd>
        );

        //return (
        //    <div className="GridOverlay absolute-max">
        //            <div className="vertical-bar"></div>
        //            <div className="horizontal-bar"></div>
        //    </div>
        //);
    }
}

export default GridOverlay;
