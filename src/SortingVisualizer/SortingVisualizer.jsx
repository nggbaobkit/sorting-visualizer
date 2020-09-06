import React from "react";
import "./SortingVisualizer.scss";

import {
  getBubbleSortAnimations,
  getHeapSortAnimations,
  getMergeSortAnimations,
  getQuickSortAnimations,
} from "../SortingAlgorithms";
import { ArrayBar, Footer, Header, MessageSnackbar } from "../content";
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
      animationSpeed: 0,
      isArraySorted: false,
      isSortingProcessPaused: false,
      isSnackbarOpened: false,
    };
  }

  componentDidMount() {
    this.setState({ arraySize: getInitialArraySize() });
    this.setState({ maxArraySize: getMaxArraySize() });
    this.setState({ array: generateRandomArray(this.state.arraySize) });
    this.setState({ animationSpeed: 5 });
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
      this.setState({ isSnackbarOpened: true });
      setInterval(() => {
        this.setState({ isSnackbarOpened: false });
      }, 2000);
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
      <div className="container-fluid app-container d-flex flex-column">
        <Header />

        <MessageSnackbar open={this.state.isSnackbarOpened} />

        <div className="row justify-content-center align-items-center control-bar-container">
          <div className="col-md-3 p-2 d-flex justify-content-center">
            <div>
              <i
                className="fas fa-search-minus"
                style={{ fontSize: "1.5em", color: "white" }}
              />{" "}
              <input
                type="range"
                style={{ width: "100px" }}
                min="5"
                max={this.state.maxArraySize}
                value={this.state.arraySize}
                id="adjustArraySize"
                disabled={this.state.isAdjustOptionsDisabled ? "disabled" : ""}
                onChange={(e) => this.setState({ arraySize: e.target.value })}
              />{" "}
              <i
                className="fas fa-search-plus"
                style={{ fontSize: "1.5em", color: "white" }}
              />
            </div>
          </div>
          <div className="col-md-3 p-2 d-flex justify-content-center">
            <div>
              <i
                className="fas fa-plane"
                style={{ fontSize: "1.5em", color: "white" }}
              />{" "}
              <input
                type="range"
                style={{ width: "100px" }}
                min="5"
                max="300"
                value={this.state.animationSpeed}
                id="animationSpeed"
                disabled={this.state.isAdjustOptionsDisabled ? "disabled" : ""}
                onChange={(e) =>
                  this.setState({ animationSpeed: e.target.value })
                }
              />{" "}
              <i
                className="fas fa-plane-slash"
                style={{ fontSize: "1.5em", color: "white" }}
              />
            </div>
          </div>
        </div>

        <ArrayBar array={array} />

        <div className="row pb-3 button-container justify-content-center align-items-center">
          <div className="col-md-2 d-flex">
            <button
              type="button"
              className="btn btn-primary flex-grow-1"
              disabled={this.state.isAdjustOptionsDisabled}
              onClick={() =>
                this.setState({
                  array: generateRandomArray(this.state.arraySize),
                })
              }
            >
              <i className="fa fa-bolt left" /> Generate new array
            </button>
          </div>
          <div className="col-md-5">
            <div className="row no-gutters">
              <div className="col d-flex">
                <button
                  type="button"
                  className="btn btn-secondary flex-grow-1"
                  disabled={this.state.isAdjustOptionsDisabled}
                  onClick={() => this.mergeSort()}
                >
                  Merge sort
                </button>
                <button
                  type="button"
                  className="btn btn-secondary flex-grow-1"
                  disabled={this.state.isAdjustOptionsDisabled}
                  onClick={() => this.bubbleSort()}
                >
                  Bubble sort
                </button>
              </div>
              <div className="col d-flex">
                <button
                  type="button"
                  className="btn btn-secondary flex-grow-1"
                  disabled={this.state.isAdjustOptionsDisabled}
                  onClick={() => this.quickSort()}
                >
                  Quick sort
                </button>
                <button
                  type="button"
                  className="btn btn-secondary flex-grow-1"
                  disabled={this.state.isAdjustOptionsDisabled}
                  onClick={() => this.heapSort()}
                >
                  Heap sort
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-2">
            <div className="row no-gutters">
              <div className="col d-flex">
                <button
                  type="button"
                  className="btn btn-danger flex-grow-1"
                  disabled={!this.state.isAdjustOptionsDisabled}
                  onClick={() => this.handleStopAnimation()}
                >
                  <i className="fas fa-stop" />
                </button>
              </div>
              <div className="col d-flex">
                <button
                  type="button"
                  className="btn btn-warning flex-grow-1"
                  disabled={this.state.animationTimer === null}
                  onClick={() => this.handlePauseAnimation()}
                >
                  {this.state.isSortingProcessPaused ? (
                    <i className="fas fa-play" />
                  ) : (
                    <i className="fas fa-pause" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}
