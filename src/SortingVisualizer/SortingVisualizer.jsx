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
import {ArrayBar, Footer} from "../content";
import {
  setArrayBarsToColor,
  generateRandomArray,
  PRIMARY_COLOR,
  SORTING_COLOR,
  MAX_VALUE_ARRAY,
  INITIAL_ARRAY_SIZE,
  MERGE_SORT,
  BUBBLE_SORT,
  QUICK_SORT,
  HEAP_SORT,
} from "../utils";

export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      array: [],
      arraySize: INITIAL_ARRAY_SIZE,
      isAdjustOptionsDisabled: false,
      intervalId: null,
      isArraySorted: false,
      lastSortAlgo: "",
      animationIdx: 0,
      isPaused: false,
    };
  }

  componentDidMount() {
    this.setState({ arraySize: INITIAL_ARRAY_SIZE });
    this.setState({
      array: generateRandomArray(MAX_VALUE_ARRAY, this.state.arraySize),
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.arraySize !== this.state.arraySize) {
      this.setState({
        array: generateRandomArray(MAX_VALUE_ARRAY, this.state.arraySize),
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
    let i = this.state.animationIdx;

    this.setState({
      intervalId: setInterval(() => {
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
          clearInterval(this.state.intervalId);
          i = 0;
          this.setState({ isAdjustOptionsDisabled: false });
          this.setState({ animationIdx: 0 });
          return;
        }
        this.setState({ animationIdx: i });
      }, 5),
    });
  }

  mergeSort = () => {
    this.setState({ lastSortAlgo: MERGE_SORT });
    const animations = getMergeSortAnimations(this.state.array);
    this.performAnimations(animations);
  };

  bubbleSort = () => {
    this.setState({ lastSortAlgo: BUBBLE_SORT });
    const animations = getBubbleSortAnimations(this.state.array);
    this.performAnimations(animations);
  };

  quickSort = () => {
    this.setState({ lastSortAlgo: QUICK_SORT });
    const animations = getQuickSortAnimations(this.state.array);
    this.performAnimations(animations);
  };

  heapSort = () => {
    this.setState({ lastSortAlgo: HEAP_SORT });
    const animations = getHeapSortAnimations(this.state.array);
    this.performAnimations(animations);
  };

  handleCreate = () => {
    this.setState({ isArraySorted: false });
    this.setState({
      array: generateRandomArray(MAX_VALUE_ARRAY, this.state.arraySize),
    });
  };

  handleCreateAndSort = () => {
    this.setState({ isArraySorted: false });
    const newArray = generateRandomArray(MAX_VALUE_ARRAY, this.state.arraySize);
    var callback;
    switch (this.state.lastSortAlgo) {
      case MERGE_SORT:
        callback = this.mergeSort;
        break;
      case BUBBLE_SORT:
        callback = this.bubbleSort;
        break;
      case QUICK_SORT:
        callback = this.quickSort;
        break;
      case HEAP_SORT:
        callback = this.heapSort;
        break;
      default:
        console.error(this.state.lastSortAlgo);
    }
    this.setState({ array: newArray }, callback);
  };

  handleStopAnimation = () => {
    clearInterval(this.state.intervalId);
    this.setState({ isAdjustOptionsDisabled: false });
    this.setState({ animationIdx: 0 });
    this.setState({ isPaused: false });
    setArrayBarsToColor(PRIMARY_COLOR);
  };

  handlePauseAnimation = () => {
    if (this.state.isPaused) {
      this.resumeAnimation();
    } else {
      this.pauseAnimation();
    }
  };

  pauseAnimation = () => {
    clearInterval(this.state.intervalId);
    this.setState({ isPaused: true });
  };

  resumeAnimation = () => {
    switch (this.state.lastSortAlgo) {
      case MERGE_SORT:
        this.mergeSort();
        break;
      case BUBBLE_SORT:
        this.bubbleSort();
        break;
      case QUICK_SORT:
        this.quickSort();
        break;
      case HEAP_SORT:
        this.heapSort();
        break;
      default:
        console.error(this.state.lastSortAlgo);
    }
    this.setState({ isPaused: false });
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
            max="150"
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
          cancelButton="Create a new array"
          confirmButton={`Create a new array and sort with ${this.state.lastSortAlgo}!`}
          onCancel={this.handleCreate}
          onConfirm={this.handleCreateAndSort}
        />
        <div className="button-container">
          <Button
            primary
            disabled={this.state.isAdjustOptionsDisabled}
            onClick={() =>
              this.setState({
                array: generateRandomArray(
                  MAX_VALUE_ARRAY,
                  this.state.arraySize
                ),
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
            disabled={this.state.animationIdx === 0}
            color="orange"
            onClick={() => this.handlePauseAnimation()}
          >
            <i class="fas fa-pause" />{" "}
            {this.state.isPaused ? "Resume" : "Pause"}
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
}
