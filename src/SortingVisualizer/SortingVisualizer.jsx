import React from 'react';
import { Button } from 'semantic-ui-react'

import './SortingVisualizer.css';
import { getMergeSortAnimations } from '../SortingAlgorithms/MergeSort.js';

const NUMBER_OF_ARRAY_BARS = 200;
const ANIMATION_SPEED_MS = 3;
const PRIMARY_COLOR = '#b07d30';
const SECONDARY_COLOR = '#25c1f5';


export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      array: [],
    };
  }

  componentDidMount() {
    this.resetArray();
  }

  resetArray() {
    const array = [];
    for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
      array.push(randomIntFromInterval(5, 600));
    }
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
        </div>
        <div className='bar-container'>
          {array.map((value, idx) => (
            <div
              className='array-bar'
              key={idx}
              style={{
                height: `${value}px`,
                backgroundColor: PRIMARY_COLOR
              }}
            ></div>
          ))}
        </div>
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