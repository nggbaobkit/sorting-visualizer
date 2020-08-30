import React from "react";
import Fade from "react-reveal/Fade";
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

  getAnimationSpeed() {
    let arrayLength = this.state.array.length;
    let speed =
      1000 - Math.pow(arrayLength, 2) > 10
        ? 1000 - Math.pow(arrayLength, 2)
        : 10;
    return speed;
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
      }, 5),
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
        <div className="header-container">
          <Fade top>
            <h1 className="header-content">
              <img className="app-logo" src={LogoPic} alt="logo" />
              Sorting Visualizer
            </h1>
          </Fade>
          <h3 className="header-content" style={{ paddingLeft: "64px" }}>
            <i class="fas fa-sliders-h" /> Adjusting array size
          </h3>
          <input
            type="range"
            min="5"
            max={this.state.maxArraySize}
            value={this.state.arraySize}
            id="adjustArraySize"
            disabled={this.state.isAdjustOptionsDisabled ? "disabled" : ""}
            onChange={(e) => this.setState({ arraySize: e.target.value })}
          />
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
