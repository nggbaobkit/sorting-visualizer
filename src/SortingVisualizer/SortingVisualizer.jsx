import React from 'react';
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
      animationSpeed: 0,
      isArraySorted: false,
      isSortingProcessPaused: false,
    };
  }

  componentDidMount() {
    this.setState({ arraySize: getInitialArraySize() });
    this.setState({ maxArraySize: getMaxArraySize() });
    this.setState({ array: generateRandomArray(this.state.arraySize) });
    this.setState({ animationSpeed: 5 });
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
      <div class='container-fluid app-container d-flex flex-column'>
        <div class='row header-container align-items-center'>
          <div class='col d-flex align-items-center'>
            <img
              style={{ maxWidth: '50px', minWidth: '50px' }}
              src={LogoPic}
              alt='logo'
            />
            <h1 class='header-content'>Sorting Visualizer</h1>
          </div>
        </div>

        <div class='row justify-content-center align-items-center control-bar-container'>
          <div class='col-md-3 p-2 d-flex justify-content-center'>
            <div>
              <i
                class='fas fa-search-minus'
                style={{ fontSize: '1.5em', color: 'white' }}
              ></i>{' '}
              <input
                type='range'
                style={{ width: '100px' }}
                min='5'
                max={this.state.maxArraySize}
                value={this.state.arraySize}
                id='adjustArraySize'
                disabled={this.state.isAdjustOptionsDisabled ? 'disabled' : ''}
                onChange={(e) => this.setState({ arraySize: e.target.value })}
              />{' '}
              <i
                class='fas fa-search-plus'
                style={{ fontSize: '1.5em', color: 'white' }}
              ></i>
            </div>
          </div>
          <div class='col-md-3 p-2 d-flex justify-content-center'>
            <div>
              <i
                class='fas fa-plane'
                style={{ fontSize: '1.5em', color: 'white' }}
              ></i>{' '}
              <input
                type='range'
                style={{ width: '100px' }}
                min='5'
                max='300'
                value={this.state.animationSpeed}
                id='animationSpeed'
                disabled={this.state.isAdjustOptionsDisabled ? 'disabled' : ''}
                onChange={(e) =>
                  this.setState({ animationSpeed: e.target.value })
                }
              />{' '}
              <i
                class='fas fa-plane-slash'
                style={{ fontSize: '1.5em', color: 'white' }}
              ></i>
            </div>
          </div>
        </div>

        <ArrayBar array={array} />

        <div class='row pb-3 button-container justify-content-center align-items-center'>
          <div class='col-md-2 d-flex'>
            <button
              type='button'
              class='btn btn-primary flex-grow-1'
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
          <div class='col-md-5'>
            <div class='row no-gutters'>
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

          <div class='col-md-2'>
            <div class='row no-gutters'>
              <div class='col d-flex'>
                <button
                  type='button'
                  class='btn btn-danger flex-grow-1'
                  disabled={!this.state.isAdjustOptionsDisabled}
                  onClick={() => this.handleStopAnimation()}
                >
                  <i class='fas fa-stop' />
                </button>
              </div>
              <div class='col d-flex'>
                <button
                  type='button'
                  class='btn btn-warning flex-grow-1'
                  disabled={this.state.animationTimer === null}
                  onClick={() => this.handlePauseAnimation()}
                >
                  {this.state.isSortingProcessPaused ? (
                    <i class='fas fa-play' />
                  ) : (
                    <i class='fas fa-pause' />
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
