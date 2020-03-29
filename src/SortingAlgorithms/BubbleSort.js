export function getBubbleSortAnimations(array) {
  let animations = [];

  for (let i = array.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      if (array[j] > array[j + 1]) {
        // swap
        animations.push([j, j + 1]);
        animations.push([j, j + 1]);
        animations.push([j, j + 1, array[j + 1], array[j]]);
        let t = array[j];
        array[j] = array[j + 1];
        array[j + 1] = t;
      }
    }
  }
  return animations;
}
