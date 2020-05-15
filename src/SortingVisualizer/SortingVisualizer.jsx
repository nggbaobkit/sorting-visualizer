import React from 'react';
import Fade from 'react-reveal/Fade';
import { Button, Confirm } from 'semantic-ui-react';

import './SortingVisualizer.scss';
import { getMergeSortAnimations } from '../SortingAlgorithms/MergeSort.js';
import { getBubbleSortAnimations } from '../SortingAlgorithms/BubbleSort.js';
import { getQuickSortAnimations } from '../SortingAlgorithms/QuickSort.js';
import { getHeapSortAnimations } from '../SortingAlgorithms/HeapSort.js';
import ArrayBar from '../ArrayBar/ArrayBar';
import Footer from '../Footer/Footer';
import LogoPic from '../img/columns.png';

import variables from '../styles/core.scss';

const PRIMARY_COLOR = variables.primaryColor;
const SORTING_COLOR = variables.sortingColor;
const MAX_VALUE_ARRAY = 400;
const INITIAL_ARRAY_SIZE = 75;
const MERGE_SORT = 'Merge Sort';
const BUBBLE_SORT = 'Bubble Sort';
const QUICK_SORT = 'Quick Sort';
const HEAP_SORT = 'Heap Sort';

export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      array: [],
      arraySize: INITIAL_ARRAY_SIZE,
      isDisabled: false,
      intervalId: null,
      isArraySorted: false,
      lastSortAlgo: '',
    };
  }

  componentDidMount() {
    this.setState({ arraySize: INITIAL_ARRAY_SIZE });
    this.setState({ array: this.generateRandomArray() });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.arraySize !== this.state.arraySize) {
      this.setState({ array: this.generateRandomArray() });
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
    this.setState({ isDisabled: true });
    let swappedArray = this.state.array.slice();
    let arrayBars = document.getElementsByClassName('array-bar');
    let i = 0;

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
          this.setState({ isDisabled: false });
          return;
        }
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

  generateRandomArray() {
    const array = [];
    for (let i = 0; i < this.state.arraySize; i++) {
      array.push(randomIntFromInterval(5, MAX_VALUE_ARRAY));
    }
    array[randomIntFromInterval(0, this.state.arraySize)] = MAX_VALUE_ARRAY;
    return array;
  }

  handleCreate = () => {
    this.setState({ isArraySorted: false });
    this.setState({ array: this.generateRandomArray() });
  };

  handleCreateAndSort = () => {
    this.setState({ isArraySorted: false });
    const newArray = this.generateRandomArray();
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

  stopAnimation = () => {
    clearInterval(this.state.intervalId);
    this.setState({ isDisabled: false });
  };

  render() {
    const { array } = this.state;

    return (
      <div>
        <div className='header-container'>
          <Fade top>
            <h1 className='header-content'>
              <img className='app-logo' src={LogoPic} alt='logo' />
              Sorting Visualizer
            </h1>
          </Fade>
          <h3 className='header-content' style={{ paddingLeft: '64px' }}>
            <i class='fas fa-sliders-h'></i> Adjusting array size
          </h3>
          <input
            type='range'
            min='5'
            max='150'
            value={this.state.arraySize}
            id='adjustArraySize'
            disabled={this.state.isDisabled ? 'disabled' : ''}
            onChange={(e) => this.setState({ arraySize: e.target.value })}
          />
        </div>
        <ArrayBar array={array}></ArrayBar>
        <Confirm
          open={this.state.isArraySorted}
          header='The array is already sorted!'
          content='You are trying to sort an already sorted array!'
          cancelButton='Create a new array'
          confirmButton={`Create a new array and sort with ${this.state.lastSortAlgo}!`}
          onCancel={this.handleCreate}
          onConfirm={this.handleCreateAndSort}
        />
        <div className='button-container'>
          <Button
            primary
            disabled={this.state.isDisabled}
            onClick={() => this.setState({ array: this.generateRandomArray() })}
          >
            <i className='fa fa-bolt left' /> Generate new array
          </Button>
          <Button
            secondary
            disabled={this.state.isDisabled}
            onClick={() => this.mergeSort()}
          >
            Merge Sort!
          </Button>
          <Button
            secondary
            disabled={this.state.isDisabled}
            onClick={() => this.bubbleSort()}
          >
            Bubble Sort!
          </Button>
          <Button
            secondary
            disabled={this.state.isDisabled}
            onClick={() => this.quickSort()}
          >
            Quick Sort!
          </Button>
          <Button
            secondary
            disabled={this.state.isDisabled}
            onClick={() => this.heapSort()}
          >
            Heap Sort!
          </Button>
          <Button
            color='red'
            disabled={!this.state.isDisabled}
            onClick={() => this.stopAnimation()}
          >
            <i class='fas fa-stop'></i> Stop
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
