import React from 'react';
import $ from 'jquery';
import './ArrayBar.css';
const PRIMARY_COLOR = '#b07d30';

const ArrayBar = props => {
  const array = props.array;
  const numWidth = Math.floor($(document).width() / (array.length * 3));
  const width = `${numWidth}px`;

  return (
    <div className='bar-container'>
      {array.map((value, idx) => (
        <div
          className='array-bar'
          key={idx}
          style={{
            height: `${value}px`,
            width: width,
            color: 'transparent',
            backgroundColor: PRIMARY_COLOR
          }}
        >
          {value}
        </div>
      ))}
    </div>
  );
};

export default ArrayBar;
