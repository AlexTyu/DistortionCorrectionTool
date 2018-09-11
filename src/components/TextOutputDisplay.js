import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import PythonCodeOutput from "./PythonCodeOutput";

import './TextOutputDisplay.css';


// TODO rename to TextOutputDisplay
class TextOutputDisplay extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

        this.createDisplayTable = this.createDisplayTable.bind(this);

    }

    // TODO put into a utils
    roundDecimalPlace(number, decimalPlaces) {
        decimalPlaces = decimalPlaces || 2;
        var multiplier = Math.pow(10, decimalPlaces);
        return Math.round(number *  multiplier) / multiplier;
    }

    createDisplayTable() {

        var pointsElement;
        var points = this.props.points;
        if (points != null && points.length > 0) {
            var formattedPoints = this.props.points
                .reduce((result, row) => { // transpose
                    return row.map((point, i) => {
                        return (result[i] || []).concat(row[i]);
                    });
                }, [])
                .map(row => {
                    var rowHtml = row.map(point => {
                        var x = this.roundDecimalPlace(point.x, 1)
                        var y = this.roundDecimalPlace(point.y, 1);
                        return (<td>[{x}, {y}]</td>);
                    })
                    return (<tr>{rowHtml}</tr>);
                    //return (<div>{row}<div>);
                })
            pointsElement = (
                <table className="points-container">
                    <tbody>
                        {formattedPoints}
                    </tbody>
                </table>
            );
        }
        else {
            pointsElement = (<div>No data available</div>);
        }

        return pointsElement;

    }

    render() {

        return (
            <div className="TextOutputDisplay">
                <Tabs>
                    <TabList>
                        <Tab>Python Code</Tab>
                        <Tab>Point Table</Tab>
                    </TabList>

                    <TabPanel style={{display: "relative"}}>
                        <PythonCodeOutput
                                trainIn={this.props.originalPoints}
                                trainOut={this.props.points}
                        />
                    </TabPanel>
                    <TabPanel>
                        <div style={{display: "flex", flexDirection: "column"}}>
                            {this.createDisplayTable()}
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
       );
    }
}

export default TextOutputDisplay;
