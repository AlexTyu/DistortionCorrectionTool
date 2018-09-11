import React, { Component } from 'react';

import './PythonCodeOutput.css';


// TODO rename to TextOutputDisplay
class PythonCodeOutput extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

        this.getCodeString = this.getCodeString.bind(this);
        this.downloadCode = this.downloadCode.bind(this);

    }

    // TODO put into a utils
    roundDecimalPlace(number, decimalPlaces) {
        decimalPlaces = decimalPlaces || 2;
        var multiplier = Math.pow(10, decimalPlaces);
        return Math.round(number *  multiplier) / multiplier ;
    }


    getCodeString() {

        var codeString = "";

        // TODO add intiialPoints
        var trainInData = this.props.trainIn;

        if (trainInData != null && trainInData.length > 0) {

            var trainInLines = "trainIn = [\n" + trainInData
                .reduce((result, row) => { // transpose
                    return row.map((point, i) => {
                        return (result[i] || []).concat(row[i]);
                    });
                }, [])
                .map(row => {
                    var rowPoints = row.map(point => {
                        var x = this.roundDecimalPlace(point.x, 4)
                        var y = this.roundDecimalPlace(point.y, 4);
                        return "[" + x + ", " + y + "]";
                    })
                    return "\t" + rowPoints.join(", ");
                    //return (<div>{row}<div>);
                }).join(",\n") + "\n]"; 

            trainInLines += "\n \n";
            codeString += trainInLines;

        }

        var trainOutData = this.props.trainOut;

        if (trainOutData != null && trainOutData.length > 0) {

            var trainOutLines = "trainOut = [\n" + trainOutData
                .reduce((result, row) => { // transpose
                    return row.map((point, i) => {
                        return (result[i] || []).concat(row[i]);
                    });
                }, [])
                .map(row => {
                    var rowPoints = row.map(point => {
                        var x = this.roundDecimalPlace(point.x, 4)
                        var y = this.roundDecimalPlace(point.y, 4);
                        return "[" + x + ", " + y + "]";
                    })
                    return "\t" + rowPoints.join(", ");
                    //return (<div>{row}<div>);
                }).join(",\n") + "\n]"; 

            trainOutLines += "\n \n";
            codeString += trainOutLines;
        }

        codeString += "\n" +
            "def setup():" + "\n" +
                "\tpass" + "\n" + 
            " \n" +
            "def getTrainIn():" + "\n" +
                "\treturn trainIn" + "\n" +
            " \n" +
            "def getTrainOut():" + "\n" +
                "\treturn trainOut" + "\n" +
        " \n";

        return codeString;

    }

    downloadCode(event) {

        var element = document.createElement('a');
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(this.getCodeString()));
        element.setAttribute("download", "distortion_input_data.py");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);

    }

    render() {

        return (
            <div className="PythonCodeOutput">
                <button className="download-button" onClick={this.downloadCode}>Download</button>
                <div className="formatted-text-code">
                    <h3>Python Code:</h3>
                    <div className="code-container">
                        <div className="code">
                            <pre>{this.getCodeString()}</pre>
                        </div>
                    </div>
                </div>
            </div>
       );
    }
}

export default PythonCodeOutput;
