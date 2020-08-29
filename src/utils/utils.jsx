export function setArrayBarsToColor(color) {
  let arrayBars = document.getElementsByClassName("array-bar");
  for (let i = 0; i < arrayBars.length; i++) {
    arrayBars[i].style.backgroundColor = color;
  }
}
