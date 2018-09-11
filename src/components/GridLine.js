import React, { Component } from 'react';

class GridLine extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        var point1IsSame = this.props.point1.x === nextProps.point1.x && this.props.point1.y === nextProps.point1.y;
        var point2IsSame = this.props.point2.x === nextProps.point2.x && this.props.point2.y === nextProps.point2.y;
        var radiusIsSame = this.props.radius === nextProps.radius;

        return !(point1IsSame && point2IsSame && radiusIsSame);
    }

    render() {

        var pointRadius = this.props.pointRadius;
        var strokeWidth = pointRadius / 2;

        var point1 = this.props.point1;
        var point2 = this.props.point2;

        var x1 = point1.x + pointRadius;
        var y1 = point1.y + pointRadius;
        var x2 = point2.x + pointRadius;
        var y2 = point2.y + pointRadius;

        return (
            <line id={this.props.id} className="GridLine" x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth={strokeWidth}></line>
        );
    }
}

export default GridLine;
