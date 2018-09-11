import React, { Component } from 'react';

import Rnd from "react-rnd";
import GridPoint from "./GridPoint";
import GridLine from "./GridLine";

import "./GridPoints.css";

class EditablePoints extends Component {


    constructor(props) {
        super(props);

        var numPoints = props.numPoints;
        var pointRadius = props.pointRadius || 4;


        this.state = {
            numPoints,
            x: props.x,
            y: props.y,
            width: props.width,
            height: props.height,
            pointRadius,
            gridPointCoordinates: [],
            initialGridPointCoordinates: [],
            offset: {
                x: props.width / 2,
                y: props.height / 2
            },
            dragPadding: 20
        };


        //this.handleReset = this.handleReset.bind(this);

        this.createPointsGrid = this.createPointsGrid.bind(this);
        this.onPointDrag = this.onPointDrag.bind(this);
        this.callParentOnChange = this.callParentOnChange.bind(this);
        this.initGridPointCoordinates = this.initGridPointCoordinates.bind(this);
        this.onDrag = this.onDrag.bind(this);


        this.state.gridPointCoordinates = this.initGridPointCoordinates();
        this.state.initialGridPointCoordinates = this.initGridPointCoordinates();

        this.callParentOnChange(this.state);

    }


    initGridPointCoordinates() {

        var state = this.state;

        var size = {
            width: state.width,
            height: state.height
        };
        var numPoints = state.numPoints;
        var pointRadius = state.pointRadius;

        var xSpacing = (size.width - 40) / numPoints; 
        var ySpacing = (size.height - 40) / numPoints;

        var xOffset = (xSpacing / 2) - pointRadius;
        var yOffset = (ySpacing / 2) - pointRadius;


        var gridPointCoordinates = Array(numPoints).fill(null).map((e, i) => {
            return Array(numPoints).fill(null).map((e, j) => {
                return {
                    x: i * xSpacing + xOffset,
                    y: j * ySpacing + yOffset
                };

            })
        })
        return gridPointCoordinates;

    }

    callParentOnChange(state) {
        console.log("callParentOnChange()", state);

        // add offset to zero points to center
        var xOffset =  -(state.width / 2) + this.state.dragPadding + this.state.pointRadius;
        var yOffset =  -(state.height / 2) + this.state.dragPadding + this.state.pointRadius;

        var points = state.gridPointCoordinates.map((row, i) => {
            return row.map((point, i) => {
                return {
                    x: point.x + xOffset,
                    y: point.y + yOffset
                };
            })
        })

        var initialPoints = state.initialGridPointCoordinates.map((row, i) => {
            return row.map((point, i) => {
                return {
                    x: point.x + xOffset,
                    y: point.y + yOffset
                };
            })
        })

        if (this.props.onChange) this.props.onChange(points, initialPoints);

    }

    onPointDrag(event, d) {

        var element = event.target;

        var id = element.id;
        if (!id) return;

        var coordinateString = id.split("_")[1]
        var coordinates = coordinateString.split(",");
        var i = coordinates[0];
        var j = coordinates[1];

        var pos = {
            x: d.x,//+element.style.left.split("px")[0],
            y: d.y//+element.style.top.split("px")[0]
        };

        this.setState((previousState, props) => {
            var newState = previousState;
            newState.gridPointCoordinates[i][j] = pos;
            this.callParentOnChange(newState);
            return newState;
        })

    }


    createPointsGrid() {

        var gridLines = [];
        var gridPoints = [];
        this.state.gridPointCoordinates.forEach((row, i) => {
            row.forEach((position, j) => {

                // create point element
                var coordinates = [i,j];
                var pointKey = "point_" + coordinates;           
                var p = <GridPoint
                        key={pointKey}
                        id={pointKey}
                        position={position}
                        radius={this.state.pointRadius}
                        onDrag={this.onPointDrag}
                    />;
                gridPoints.push(p);

                // create line elements
                if (i > 0) {
                    let point1 = this.state.gridPointCoordinates[i - 1][j];
                    let point2 = this.state.gridPointCoordinates[i][j];
                    let lineKey = "line_" + 
                            (i - 1) + "," + j + "-" +
                            i + "," + j; 
                    let line = <GridLine
                            key={lineKey}
                            id={lineKey}
                            point1={point1}
                            point2={point2}
                            pointRadius={this.state.pointRadius}
                        />;
                    gridLines.push(line);
                }
                if (j > 0) {
                    let point1 = this.state.gridPointCoordinates[i][j - 1];
                    let point2 = this.state.gridPointCoordinates[i][j];
                    let lineKey = "line_" + 
                            i + "," + (j - 1) + "-" +
                            i + "," + j;
                    let line = <GridLine
                            key={lineKey}
                            id={lineKey}
                            point1={point1}
                            point2={point2}
                            pointRadius={this.state.pointRadius}
                        />;
                    gridLines.push(line);
                }
            })
        })

        return {gridLines, gridPoints};

    }


    onDrag(event, d) {
        delete d.node;
        console.log("GridPoints onDrag()", d);
        
        var position = {
            x: d.x - this.state.x,
            y: d.y - this.state.y
        };
        this.setState(previousState => {
            var newState = previousState;
            newState.position = position;
            if (this.props.onDrag) this.props.onDrag(position);
            return newState;
        });
    }

    render() {

        //this.handleReset();

        var {gridPoints, gridLines} = this.createPointsGrid();

        var defaultConfig = {
            x: this.state.x,
            y: this.state.y,
            width: this.state.width,
            height: this.state.height
        };

        return (
            <Rnd
                    className="GridPoints box"
                    default={defaultConfig}
                    minWidth={100}
                    minHeight={100}
                    style={{padding: this.state.dragPadding}}
                    cancel=".cancel"
                    onDrag={this.onDrag}
                >
                <div className="cancel container" style={{position: "relative", width: "100%", height: "100%"}}>
                    <svg width="100%" height="100%">{gridLines}</svg>
                    {gridPoints}
                </div>
            </Rnd>
            
        );
    }
}

export default EditablePoints;
