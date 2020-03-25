import React from 'react';
import { Button } from 'semantic-ui-react'

import './SortingVisualizer.css';

const NUMBER_OF_ARRAY_BARS = 300;


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
      array.push(randomIntFromInterval(5, 700));
    }
    this.setState({ array });
  }

  mergeSort() {

  }

  quickSort() {

  }

  heapSort() {

  }

  bubbleSort() {

  }

  render() {
    const { array } = this.state;

    return (
      <div className="array-container">
        {array.map((value, idx) => (
          <div
            className="array-bar"
            key={idx}
            style={{
              height: `${value}px`,
            }}></div>
        ))}
        <Button primary onClick={() => this.resetArray()}>
          Generate new array
        </Button>
        <Button secondary onClick={() => this.mergeSort()}>
          Merge Sort
        </Button>
        <Button secondary onClick={() => this.quickSort()}>
          Quick Sort
        </Button>
        <Button secondary onClick={() => this.heapSort()}>
          Heap Sort
        </Button>
        <Button secondary onClick={() => this.bubbleSort()}>
          Bubble Sort
        </Button>
      </div>
    );
  }
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}