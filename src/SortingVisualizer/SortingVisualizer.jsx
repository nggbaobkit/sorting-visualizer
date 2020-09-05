import React from "react";
import { Button, Confirm } from "semantic-ui-react";

import "./SortingVisualizer.scss";
import LogoPic from "../img/columns.png";

import {
  getBubbleSortAnimations,
  getHeapSortAnimations,
  getMergeSortAnimations,
  getQuickSortAnimations,
} from "../SortingAlgorithms";
import { ArrayBar, Footer } from "../content";
import {
  setArrayBarsToColor,
  generateRandomArray,
  PRIMARY_COLOR,
  SORTING_COLOR,
  IntervalTimer,
  debounce,
  getInitialArraySize,
  getMaxArraySize,
} from "../utils";

export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      array: [],
      arraySize: 0,
      maxArraySize: 0,
      isAdjustOptionsDisabled: false,
      animationTimer: null,
      isArraySorted: false,
      isSortingProcessPaused: false,
    };
  }

  componentDidMount() {
    this.setState({ arraySize: getInitialArraySize() });
    this.setState({ maxArraySize: getMaxArraySize() });
    this.setState({ array: generateRandomArray(this.state.arraySize) });
    this.setState( { animationSpeed: 5});
    window.addEventListener(
      "resize",
      debounce(() => {
        this.setState({ arraySize: getInitialArraySize() });
        this.setState({ maxArraySize: getMaxArraySize() });
        this.setState({ array: generateRandomArray(this.state.arraySize) });
      }, 500)
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.arraySize !== this.state.arraySize) {
      this.setState({
        array: generateRandomArray(this.state.arraySize),
      });
    }
  }

  performAnimations(animations) {
    if (animations.length === 0) {
      this.setState({ isArraySorted: true });
      return;
    }
    this.setState({ isAdjustOptionsDisabled: true });
    let swappedArray = this.state.array.slice();
    let arrayBars = document.getElementsByClassName("array-bar");
    let i = 0;

    this.setState({
      animationTimer: new IntervalTimer(() => {
        const isColorChange = i % 3 !== 2;

        if (isColorChange) {
          let [barOneIdx, barTwoIdx] = animations[i];
          let barOneStyle = arrayBars[barOneIdx].style;
          let barTwoStyle = arrayBars[barTwoIdx].style;
          const color = i % 3 === 0 ? SORTING_COLOR : PRIMARY_COLOR;
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        } else {
          const [barOneIdx, barTwoIdx, newOneHeight, newTwoHeight] = animations[
            i
          ];
          swappedArray[barOneIdx] = newOneHeight;
          swappedArray[barTwoIdx] = newTwoHeight;
          this.setState({ array: swappedArray });
        }
        i += 1;
        if (i >= animations.length) {
          this.state.animationTimer.stop();
          this.setState({ isAdjustOptionsDisabled: false });
          this.setState({ animationTimer: null });
        }
      }, this.state.animationSpeed),
    });
  }

  mergeSort = () => {
    const animations = getMergeSortAnimations(this.state.array);
    this.performAnimations(animations);
  };

  bubbleSort = () => {
    const animations = getBubbleSortAnimations(this.state.array);
    this.performAnimations(animations);
  };

  quickSort = () => {
    const animations = getQuickSortAnimations(this.state.array);
    this.performAnimations(animations);
  };

  heapSort = () => {
    const animations = getHeapSortAnimations(this.state.array);
    this.performAnimations(animations);
  };

  handleCreate = () => {
    this.setState({ isArraySorted: false });
    this.setState({
      array: generateRandomArray(this.state.arraySize),
    });
  };

  handleCreateAndSort = () => {
    this.setState({ isArraySorted: false });
    this.setState({
      array: generateRandomArray(this.state.arraySize),
    });
  };

  handleStopAnimation = () => {
    this.state.animationTimer.stop();
    this.setState({ isAdjustOptionsDisabled: false });
    this.setState({ animationTimer: null });
    this.setState({ isSortingProcessPaused: false });
    setArrayBarsToColor(PRIMARY_COLOR);
  };

  handlePauseAnimation = () => {
    if (this.state.isSortingProcessPaused) {
      this.resumeAnimation();
    } else {
      this.pauseAnimation();
    }
  };

  pauseAnimation = () => {
    this.state.animationTimer.pause();
    this.setState({ isSortingProcessPaused: true });
  };

  resumeAnimation = () => {
    this.state.animationTimer.resume();
    this.setState({ isSortingProcessPaused: false });
  };

  render() {
    const { array } = this.state;

    return (
      <div>
        <div className="container-fluid d-flex header-container p-3">
          <div className="row justify-content-center align-self-center">
            <img className="app-logo" src={LogoPic} alt="logo" />
            <h1 className="header-content">
              Sorting Visualizer
            </h1>
          </div>
        </div>
        <div class="row">
          <div class="col adjust-options-container d-flex justify-content-end p-1 pr-3">
            <h4 className="adjust-options-content">
              <i className="fas fa-sliders-h"/> Array size
            </h4>
            <input
                type="range"
                min="5"
                max={this.state.maxArraySize}
                value={this.state.arraySize}
                id="adjustArraySize"
                disabled={this.state.isAdjustOptionsDisabled ? "disabled" : ""}
                onChange={(e) => this.setState({arraySize: e.target.value})}
            />
          </div>
          <div className="col adjust-options-container d-flex p-1 pl-3">
            <h4 className="adjust-options-content">
              Slow
            </h4>
            <input
                type="range"
                min='5'
                max='300'
                value={this.state.animationSpeed}
                id="animationSpeed"
                disabled={this.state.isAdjustOptionsDisabled ? "disabled" : ""}
                onChange={(e) => this.setState({animationSpeed: e.target.value})}
            />
            <h4 className="adjust-options-content">
              Slow
            </h4>
          </div>
        </div>
        <ArrayBar array={array} />
        <Confirm
          open={this.state.isArraySorted}
          header="The array is already sorted!"
          content="You are trying to sort an already sorted array!"
          cancelButton="Cancel"
          confirmButton={`Generate a new array!`}
          onCancel={() => {
            this.setState({ isArraySorted: false });
          }}
          onConfirm={this.handleCreateAndSort}
        />
        <div className="button-container">
          <Button
            primary
            disabled={this.state.isAdjustOptionsDisabled}
            onClick={() =>
              this.setState({
                array: generateRandomArray(this.state.arraySize),
              })
            }
          >
            <i className="fa fa-bolt left" /> Generate new array
          </Button>
          <Button
            secondary
            disabled={this.state.isAdjustOptionsDisabled}
            onClick={() => this.mergeSort()}
          >
            Merge Sort!
          </Button>
          <Button
            secondary
            disabled={this.state.isAdjustOptionsDisabled}
            onClick={() => this.bubbleSort()}
          >
            Bubble Sort!
          </Button>
          <Button
            secondary
            disabled={this.state.isAdjustOptionsDisabled}
            onClick={() => this.quickSort()}
          >
            Quick Sort!
          </Button>
          <Button
            secondary
            disabled={this.state.isAdjustOptionsDisabled}
            onClick={() => this.heapSort()}
          >
            Heap Sort!
          </Button>
          <Button
            color="red"
            disabled={!this.state.isAdjustOptionsDisabled}
            onClick={() => this.handleStopAnimation()}
          >
            <i class="fas fa-stop" /> Stop
          </Button>
          <Button
            disabled={this.state.animationTimer === null}
            color="orange"
            onClick={() => this.handlePauseAnimation()}
          >
            <i class="fas fa-pause" />{" "}
            {this.state.isSortingProcessPaused ? "Resume" : "Pause"}
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
}
