import React from 'react';
import Fade from 'react-reveal/Fade';
import { Button } from 'semantic-ui-react';

import './SortingVisualizer.scss';
import { getMergeSortAnimations } from '../SortingAlgorithms/MergeSort.js';
import { getBubbleSortAnimations } from '../SortingAlgorithms/BubbleSort.js';
import { getQuickSortAnimations } from '../SortingAlgorithms/QuickSort.js';
import { getHeapSortAnimations } from '../SortingAlgorithms/HeapSort.js';
import ArrayBar from '../ArrayBar/ArrayBar';
import Footer from '../Footer/Footer';

import variables from '../styles/core.scss';

const PRIMARY_COLOR = variables.primaryColor;
const SORTING_COLOR = variables.sortingColor;
const MAX_VALUE_ARRAY = 400;
const INITIAL_ARRAY_SIZE = 75;

export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      array: [],
      arraySize: 0,
      isDisabled: false
    };
  }

  componentDidMount() {
    this.setState({ arraySize: INITIAL_ARRAY_SIZE });
    this.resetArray();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.arraySize !== this.state.arraySize) {
      this.resetArray();
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

  resetArray() {
    const array = [];
    for (let i = 0; i < this.state.arraySize; i++) {
      array.push(randomIntFromInterval(5, MAX_VALUE_ARRAY));
    }
    array[randomIntFromInterval(0, this.state.arraySize)] = MAX_VALUE_ARRAY;
    this.setState({ array });
  }

  performAnimations(animations) {
    this.setState({ isDisabled: true });
    let swappedArray = this.state.array.slice();
    for (let i = 0; i < animations.length; i++) {
      let arrayBars = document.getElementsByClassName('array-bar');
      let isColorChange = i % 3 !== 2;

      if (isColorChange) {
        let [barOneIdx, barTwoIdx] = animations[i];
        let barOneStyle = arrayBars[barOneIdx].style;
        let barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 3 === 0 ? SORTING_COLOR : PRIMARY_COLOR;
        setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * this.getAnimationSpeed());
      } else {
        setTimeout(() => {
          const [barOneIdx, barTwoIdx, newOneHeight, newTwoHeight] = animations[
            i
          ];
          swappedArray[barOneIdx] = newOneHeight;
          swappedArray[barTwoIdx] = newTwoHeight;
          this.setState({ array: swappedArray });
        }, i * this.getAnimationSpeed());
      }
    }
    setTimeout(() => {
      this.setState({ isDisabled: false });
    }, animations.length * this.getAnimationSpeed());
  }

  mergeSort() {
    const animations = getMergeSortAnimations(this.state.array);
    this.performAnimations(animations);
  }

  bubbleSort() {
    const animations = getBubbleSortAnimations(this.state.array);
    this.performAnimations(animations);
  }

  quickSort() {
    const animations = getQuickSortAnimations(this.state.array);
    this.performAnimations(animations);
  }

  heapSort() {
    const animations = getHeapSortAnimations(this.state.array);
    this.performAnimations(animations);
  }

  render() {
    const { array } = this.state;

    return (
      <div>
        <div className='header-container'>
          <Fade top>
            <h1 className='header-content'>
              <img className='app-logo' src='columns.png' alt='logo' />
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
            onChange={e => this.setState({ arraySize: e.target.value })}
          />
        </div>
        <ArrayBar array={array}></ArrayBar>
        <div className='button-container'>
          <Button
            primary
            disabled={this.state.isDisabled}
            onClick={() => this.resetArray()}
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
