import React, { Component } from 'react';

import Rnd from "react-rnd";
import GridPoint from "./GridPoint";
import GridLine from "./GridLine";

import "./OriginalPoints.css";

class OriginalPoints extends Component {


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
            points: [],
            offset: {
                x: props.width / 2,
                y: props.height / 2
            },
            dragPadding: 20
        };


        //this.handleReset = this.handleReset.bind(this);

        this.createPointsHtml = this.createPointsHtml.bind(this);
        this.callParentOnChange = this.callParentOnChange.bind(this);
        this.initPoints = this.initPoints.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.onResize = this.onResize.bind(this);


        this.state.points = this.initPoints(this.state);

        this.callParentOnChange(this.state);

    }


    initPoints(state) {
        console.log("initPoints()");

        state = state || this.state;

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


        var points = Array(numPoints).fill(null).map((e, i) => {
            return Array(numPoints).fill(null).map((e, j) => {
                return {
                    x: i * xSpacing + xOffset,
                    y: j * ySpacing + yOffset
                };

            })
        })
        return points;

    }

    callParentOnChange(state) {
        console.log("callParentOnChange()", state);

        // add offset to zero points to center
        var xOffset =  -(state.width / 2) + this.state.dragPadding + this.state.pointRadius;
        var yOffset =  -(state.height / 2) + this.state.dragPadding + this.state.pointRadius;

        var points = state.points.map((row, i) => {
            return row.map((point, i) => {
                return {
                    x: point.x + xOffset,
                    y: point.y + yOffset
                };
            })
        })

        if (this.props.onChange) this.props.onChange(points);

    }


    createPointsHtml() {

        var gridLines = [];
        var gridPoints = [];
        this.state.points.forEach((row, i) => {
            row.forEach((position, j) => {

                // create point element
                var coordinates = [i,j];
                var pointKey = "point_" + coordinates;           
                var p = <GridPoint
                        key={pointKey}
                        id={pointKey}
                        position={position}
                        radius={this.state.pointRadius}
                        disableDragging={true}
                    />;
                gridPoints.push(p);

                // create line elements
                if (i > 0) {
                    let point1 = this.state.points[i - 1][j];
                    let point2 = this.state.points[i][j];
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
                    let point1 = this.state.points[i][j - 1];
                    let point2 = this.state.points[i][j];
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
        console.log("OriginalPoints onDrag()", d);
        
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

    onResize(e, direction, ref, delta, position) {
        console.log("OriginalPoints onResize()");
        this.setState(previousState => {
            var newState = previousState;

            newState.width = ref.offsetWidth;
            newState.height = ref.offsetHeight;

            newState.points = this.initPoints(newState);

            this.callParentOnChange(newState)

            return newState;
        })
    }

    render() {

        //this.handleReset();

        var {gridPoints, gridLines} = this.createPointsHtml();

        var defaultConfig = {
            x: this.state.x,
            y: this.state.y,
            width: this.state.width,
            height: this.state.height
        };

        return (
            <Rnd
                    className="OriginalPoints box"
                    default={defaultConfig}
                    size={{width: this.state.width, height: this.state.height}}
                    minWidth={100}
                    minHeight={100}
                    style={{padding: this.state.dragPadding}}
                    cancel=".cancel"
                    onDrag={this.onDrag}
                    onResize={this.onResize}
                >
                <div className="container">
                    <svg width="100%" height="100%">{gridLines}</svg>
                    {gridPoints}
                </div>
            </Rnd>
            
        );
    }
}

export default OriginalPoints;

