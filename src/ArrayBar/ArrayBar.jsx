import React from "react";
import $ from "jquery";
import "./ArrayBar.scss";

const ArrayBar = (props) => {
  const array = props.array;
  const numWidth = Math.floor($(document).width() / (array.length * 3));
  const width = `${numWidth}px`;
  const numMargin =
    array.length < 5
      ? 10
      : array.length < 8
      ? 8
      : array.length < 11
      ? 6
      : array.length < 20
      ? 4
      : array.length < 50
      ? 3.5
      : array.length < 100
      ? 3
      : array.length < 130
      ? 2.5
      : 2;
  const margin = `${numMargin}px`;
  const color = numWidth > 20 ? "white" : "transparent";
  const numFont =
    numWidth > 70
      ? 23
      : numWidth > 60
      ? 18
      : numWidth > 50
      ? 16
      : numWidth > 40
      ? 14
      : numWidth > 30
      ? 12
      : numWidth > 20
      ? 10
      : 8;
  const fontSize = `${numFont}px`;

  return (
    <div className="bar-container">
      {array.map((value, idx) => (
        <div
          className="array-bar"
          key={idx}
          style={{
            height: `${value}px`,
            width: width,
            marginLeft: margin,
            marginRigh: margin,
            color: color,
            fontSize: fontSize,
          }}
        >
          {value}
        </div>
      ))}
    </div>
  );
};

export default ArrayBar;
