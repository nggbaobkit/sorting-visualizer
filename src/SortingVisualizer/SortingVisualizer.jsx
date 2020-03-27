import React from 'react';
import { Button } from 'semantic-ui-react';

import './SortingVisualizer.css';
import { getMergeSortAnimations } from '../SortingAlgorithms/MergeSort.js';
import ArrayBar from '../ArrayBar/ArrayBar';

const ANIMATION_SPEED_MS = 3;
const PRIMARY_COLOR = '#b07d30';
const SECONDARY_COLOR = '#25c1f5';
const MAX_VALUE_ARRAY = 480;

export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      array: [],
      arraySize: 0
    };
  }

  componentDidMount() {
    this.setState({ arraySize: 130 });
    this.resetArray();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.arraySize !== this.state.arraySize) {
      this.resetArray();
    }
  }

  resetArray() {
    const array = [];
    for (let i = 0; i < this.state.arraySize; i++) {
      array.push(randomIntFromInterval(5, MAX_VALUE_ARRAY));
    }
    array[randomIntFromInterval(0, this.state.arraySize)] = MAX_VALUE_ARRAY;
    this.setState({ array });
  }

  mergeSort() {
    const animations = getMergeSortAnimations(this.state.array);
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 3 !== 2;
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
        setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * ANIMATION_SPEED_MS);
      } else {
        setTimeout(() => {
          const [barOneIdx, newHeight] = animations[i];
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${newHeight}px`;
        }, i * ANIMATION_SPEED_MS);
      }
    }
  }

  render() {
    const { array } = this.state;

    return (
      <div>
        <div className='header-container'>
          <h1 className='header-content'>Sorting Visualizer</h1>
          <h3 className='header-content' style={{ paddingLeft: '64px' }}>
            Adjusting array size
          </h3>
          <input
            type='range'
            min='5'
            max='250'
            value={this.state.arraySize}
            id='adjustArraySize'
            onChange={e => this.setState({ arraySize: e.target.value })}
          />
        </div>
        <ArrayBar array={array}></ArrayBar>
        <div className='button-container'>
          <Button primary onClick={() => this.resetArray()}>
            Generate new array
          </Button>
          <Button secondary onClick={() => this.mergeSort()}>
            Merge Sort!
          </Button>
        </div>
      </div>
    );
  }
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
