export function setArrayBarsToColor(color) {
  let arrayBars = document.getElementsByClassName('array-bar');
  for (let i = 0; i < arrayBars.length; i++) {
    arrayBars[i].style.backgroundColor = color;
  }
}

export function generateRandomArray(arrSize) {
  let barContainers = document.getElementsByClassName('bar-container');
  let maxVal = barContainers[0].clientHeight;
  const array = [];
  for (let i = 0; i < arrSize; i++) {
    array.push(randomIntFromInterval(5, maxVal * 0.85));
  }
  return array;
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function IntervalTimer(callback, interval) {
  const TIMER_STATE = Object.freeze({
    idle: 0,
    running: 1,
    paused: 2,
    resumed: 3,
  });
  let timerId,
    startTime,
    remaining = 0;
  let timerState = TIMER_STATE.idle;

  this.pause = function () {
    if (timerState !== TIMER_STATE.running) return;

    remaining = interval - (new Date() - startTime);
    clearInterval(timerId);
    timerState = TIMER_STATE.paused;
  };

  this.resume = function () {
    if (timerState !== TIMER_STATE.paused) return;

    timerState = TIMER_STATE.resumed;
    setTimeout(this.timeoutCallback, remaining);
  };

  this.timeoutCallback = function () {
    if (timerState !== TIMER_STATE.resumed) return;

    callback();

    startTime = new Date();
    timerId = setInterval(callback, interval);
    timerState = TIMER_STATE.running;
  };

  this.stop = function () {
    clearInterval(timerId);
  };

  startTime = new Date();
  timerId = setInterval(callback, interval);
  timerState = TIMER_STATE.running;
}

export const debounce = (fn, delay) => {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export function getInitialArraySize() {
  return window.innerWidth / 40;
}

export function getMaxArraySize() {
  return window.innerWidth / 20;
}
