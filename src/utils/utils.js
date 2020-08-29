export function setArrayBarsToColor(color) {
  let arrayBars = document.getElementsByClassName("array-bar");
  for (let i = 0; i < arrayBars.length; i++) {
    arrayBars[i].style.backgroundColor = color;
  }
}

export function generateRandomArray(maxValue, arrSize) {
  const array = [];
  for (let i = 0; i < arrSize; i++) {
    array.push(randomIntFromInterval(5, maxValue));
  }
  array[randomIntFromInterval(0, arrSize)] = maxValue;
  return array;
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
