import React, { Component } from "react";

import "./App.css";
import "react-tabs/style/react-tabs.css";

import Toolbar from "./components/Toolbar";
import ImageUploader from "./components/ImageUploader";
import GridEditor from "./components/GridEditor";
import TextOutputDisplay from "./components/TextOutputDisplay";

import {EDITOR_WIDTH, EDITOR_HEIGHT, NUM_GRID_POINTS} from "./config";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            imageData: "/20180508_175839.jpg",
            points: null,
            initialPoints: null
        };

        this.onImageUploaded = this.onImageUploaded.bind(this);
        this.onGridChange = this.onGridChange.bind(this);
        this.handleScroll = this.handleScroll.bind(this);

    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll(event) {
        if (window.scrollY > 100 && this.state.hideScrollButton !== true) {
            this.setState(previousState => {
                var newState = previousState;
                newState.hideScrollButton = true;
                return newState;
            })
        }
    }

    onImageUploaded(imageData) {
        this.setState(previousState => {
            var newState = previousState;
            newState.imageData = imageData;
            return newState;
        });
    }

    onGridChange(points, originalPoints) {
        console.log("onGridChange()", points, originalPoints);
        this.setState(previousState => {
            var newState = previousState;
            newState.points = points;
            newState.originalPoints = originalPoints;
            return newState;
        })
    }

    onScrollButtonClicked() {
        window.scrollTo(0,500);
    }


    render() {

        return (
            <div className="App">
                <Toolbar />
                <ImageUploader
                        onImageUploaded={this.onImageUploaded}
                />
                <div className="main-container">
                    <div className="grid-container">
                        <GridEditor
                                imageSrc={this.state.imageData}
                                onChange={this.onGridChange}
                                width={EDITOR_WIDTH}
                                height={EDITOR_HEIGHT}
                                numPoints={NUM_GRID_POINTS}
                        />
                    </div>
                    <div className="coordinates-display-container">
                        <TextOutputDisplay
                                points={this.state.points}
                                originalPoints={this.state.originalPoints}
                        />
                    </div>
                </div>
                <div className={["scroll-button", this.state.hideScrollButton ? "hidden" : ""].join(" ")} onClick={this.onScrollButtonClicked}>
                    &#9660;
                </div>
            </div>
       );
    }
}

export default App;
