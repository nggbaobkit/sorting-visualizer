import React from 'react';
import { Button, Confirm } from 'semantic-ui-react';

import './SortingVisualizer.scss';
import LogoPic from '../img/columns.png';

import {
  getBubbleSortAnimations,
  getHeapSortAnimations,
  getMergeSortAnimations,
  getQuickSortAnimations,
} from '../SortingAlgorithms';
import { ArrayBar, Footer } from '../content';
import {
  setArrayBarsToColor,
  generateRandomArray,
  PRIMARY_COLOR,
  SORTING_COLOR,
  IntervalTimer,
  debounce,
  getInitialArraySize,
  getMaxArraySize,
} from '../utils';

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
      'resize',
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
    let arrayBars = document.getElementsByClassName('array-bar');
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
      <div class='container-fluid app-container d-flex flex-column'>
        <div class='row header-container align-items-center'>
          <div class='col'>
            <h1 class='header-content'>Sorting Visualizer</h1>
          </div>
        </div>

        <div class='row'>
          <div class='col control-bar-container'>
            <h1>Control bar</h1>
          </div>
        </div>

        <ArrayBar array={array} />

        <div class='row pb-3 button-container text-center'>
          <div class='col-md-3'>
            <button
              type='button'
              class='btn btn-primary btn-block'
              disabled={this.state.isAdjustOptionsDisabled}
              onClick={() =>
                this.setState({
                  array: generateRandomArray(this.state.arraySize),
                })
              }
            >
              <i class='fa fa-bolt left' /> Generate
            </button>
          </div>
          <div class='col-md-6'>
            <div class='row'>
              <div className='col d-flex'>
                <button
                  type='button'
                  class='btn btn-secondary flex-grow-1'
                  disabled={this.state.isAdjustOptionsDisabled}
                  onClick={() => this.mergeSort()}
                >
                  Merge sort
                </button>
                <button
                  type='button'
                  class='btn btn-secondary flex-grow-1'
                  disabled={this.state.isAdjustOptionsDisabled}
                  onClick={() => this.bubbleSort()}
                >
                  Bubble sort
                </button>
              </div>
              <div className='col d-flex'>
                <button
                  type='button'
                  class='btn btn-secondary flex-grow-1'
                  disabled={this.state.isAdjustOptionsDisabled}
                  onClick={() => this.quickSort()}
                >
                  Quick sort
                </button>
                <button
                  type='button'
                  class='btn btn-secondary flex-grow-1'
                  disabled={this.state.isAdjustOptionsDisabled}
                  onClick={() => this.heapSort()}
                >
                  Heap sort
                </button>
              </div>
            </div>
          </div>

          <div class='col-md-3'>
            <div class='row'>
              <div class='col'>
                <button
                  type='button'
                  class='btn btn-danger btn-block'
                  disabled={!this.state.isAdjustOptionsDisabled}
                  onClick={() => this.handleStopAnimation()}
                >
                  <i class='fas fa-stop' /> Stop
                </button>
              </div>
              <div class='col'>
                <button
                  type='button'
                  class='btn btn-warning btn-block'
                  disabled={this.state.animationTimer === null}
                  onClick={() => this.handlePauseAnimation()}
                >
                  <i class='fas fa-pause' />{' '}
                  {this.state.isSortingProcessPaused ? 'Resume' : 'Pause'}
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
