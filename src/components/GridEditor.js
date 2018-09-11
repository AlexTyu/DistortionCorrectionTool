import React, { Component } from 'react';

import "./GridEditor.css"

import GridImage from "./GridImage";
import EditablePoints from "./GridPoints";
import OriginalPoints from "./OriginalPoints";
import GridOverlay from "./GridOverlay";


class GridEditor extends Component {

    constructor(props) {
        super(props);

        this.state = {
            axisOffset: {
                x: 0,
                y: 0
            },
            zoom: {
                x: 0,
                y: 0
            },
            originalPointsOffset: {
                x: 0,
                y: 0
            },
            editablePointsOffset: {
                x: 0,
                y: 0
            },
            points: [],
            originalPoints: [],
            width: props.width,
            height: props.height,
            numPoints: props.numPoints
        };

        this.callOnChange = this.callOnChange.bind(this);
        this.onEditablePointsChange = this.onEditablePointsChange.bind(this);
        this.onDragAxis = this.onDragAxis.bind(this);
        this.onZoomAxis = this.onZoomAxis.bind(this);
        this.onDragEditablePoints = this.onDragEditablePoints.bind(this);
        this.onDragOriginalPoints = this.onDragOriginalPoints.bind(this);
        this.onOriginalPointsChange = this.onOriginalPointsChange.bind(this);
        this.onZoomInputChange = this.onZoomInputChange.bind(this);

    }

    callOnChange(state) {
        console.log("GridEditor callOnChange()", state);

        var editableXOffset = -state.axisOffset.x + state.editablePointsOffset.x;
        var editableYOffset = -state.axisOffset.y + state.editablePointsOffset.y;

        var minDim = Math.min(this.state.width, this.state.height);
        var zoom = {
            x: Math.pow(2, this.state.zoom.x) * (minDim / 4),
            y: Math.pow(2, this.state.zoom.y) * (minDim / 4)
        }
        console.log("minDim", minDim);
        console.log("zoom", zoom);

        var offsetPoints = state.points.map((row, i) => {
            return row.map(point => {

                var x = point.x;
                x += editableXOffset;
                x /= zoom.x;

                var y = point.y;
                y = -y;
                y -= editableYOffset;
                y /= zoom.y;

                //return {x: -x, y: -y};
                return {x, y};
            })
        });

        var originalXOffset = -state.axisOffset.x + state.originalPointsOffset.x;
        var originalYOffset = -state.axisOffset.y + state.originalPointsOffset.y;

        var offsetOriginalPoints = state.originalPoints.map((row, i) => {
            return row.map(point => {

                var x = point.x;
                x += originalXOffset;
                x /= zoom.x;

                var y = point.y;
                y = -y;
                y -= originalYOffset;
                y /= zoom.y;

                //return {x: -x, y: -y};
                return {x, y};
            })
        });

        //if (this.props.onChange) this.props.onChange(offsetPoints, offsetInitialPoints);
        if (this.props.onChange) this.props.onChange(offsetPoints, offsetOriginalPoints);

    }

    onEditablePointsChange(points) {
        console.log("GridEditor onEditablePointsChange()", points);

        this.setState(previousState => {
            var newState = previousState;
            newState.points = points;

            this.callOnChange(newState);

            return newState;

        });
    }

    onDragAxis(position) {
        console.log("onDragAxis()", position);
        this.setState(previousState => {
            var newState = previousState;
            newState.axisOffset = position;

            this.callOnChange(newState);

            return newState;

        })
    }

    onZoomAxis(zoom) {
        console.log("onZoomAxis()", zoom);

        this.setState(previousState => {
            var newState = previousState;
            newState.zoom = zoom;

            this.callOnChange(newState);

            return newState;
        })
    }

    onOriginalPointsChange(points) {
        console.log("onOriginalPointsChange()");
        this.setState(previousState => {
            var newState = previousState;
            newState.originalPoints = points;

            this.callOnChange(newState);

            return newState;
        })
    }

    onDragOriginalPoints(position) {
        console.log("onDragOriginalPoints()", position);
        this.setState(previousState => {
            var newState = previousState;
            newState.originalPointsOffset = position;

            this.callOnChange(newState);

            return newState;
        })
    }

    onDragEditablePoints(position) {
        console.log("onDragEditablePoints()", position);
        this.setState(previousState => {
            var newState = previousState;
            newState.editablePointsOffset = position;

            this.callOnChange(newState);

            return newState;
        })
    }

    onZoomInputChange(event) {
        console.log("onZoomInputChange()");

        var id = event.target.id
        var axis = id.substr(id.length - 1); // id in the form of zoom-input-x
        console.log("axis", axis);

        var inputValue = event.target.value;

        this.setState(previousState => {
            var newState = previousState;
            newState.zoom[axis] = inputValue;

            this.callOnChange(newState);

            return newState;
        })
    }

    render() {

        var initialRatio = 0.8;
        var minDim = Math.min(this.state.width, this.state.height);
        var initialX = (this.state.width - (minDim * initialRatio)) / 2;
        var initialY = (this.state.height - (minDim * initialRatio)) / 2;
        var initialWidth = minDim * initialRatio;
        var initialHeight = minDim * initialRatio;

        return (
            <div className="GridEditor" style={{width: this.state.width, height: this.state.height}}>
                {/*TODO change to more approporiate name like "GridBackgroundAxis"*/}
                <GridOverlay
                        width={this.state.width}
                        height={this.state.height}
                        onDrag={this.onDragAxis}
                        onZoom={this.onZoomAxis}
                        zoom={this.state.zoom}
                />
                <GridImage
                        imageSrc={this.props.imageSrc}
                        x={initialX}
                        y={initialY}
                        width={initialWidth}
                        height={initialHeight}
                />
                <EditablePoints
                        x={initialX}
                        y={initialY}
                        width={initialWidth}
                        height={initialHeight}
                        numPoints={this.state.numPoints}
                        onChange={this.onEditablePointsChange}
                        onDrag={this.onDragEditablePoints}
                />
                <OriginalPoints
                        x={initialX}
                        y={initialY}
                        width={initialWidth}
                        height={initialHeight}
                        numPoints={this.state.numPoints}
                        onDrag={this.onDragOriginalPoints}
                        onChange={this.onOriginalPointsChange}
                    
                />
                <div className="controls">
                    <div className="input-container">
                        <label htmlFor="zoom-input-x">Zoom X: </label>
                        <input id="zoom-input-x" type="number" onChange={this.onZoomInputChange} value={this.state.zoom.x} step="0.1"></input>
                    </div>
                    <div className="input-container">
                        <label htmlFor="zoom-input-y">Zoom Y: </label>
                        <input id="zoom-input-y" type="number" onChange={this.onZoomInputChange} value={this.state.zoom.y} step="0.1"></input>
                    </div>
                </div>
            </div>
            
        );
    }
}

export default GridEditor;
