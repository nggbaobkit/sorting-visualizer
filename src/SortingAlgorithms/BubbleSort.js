import { swap, pushAnimations } from './Utilities';

export function getBubbleSortAnimations(array) {
  let animations = [];

  for (let i = array.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      if (array[j] > array[j + 1]) {
        pushAnimations(animations, array, j, j + 1);
        swap(array, j, j + 1);
      }
    }
  }
  return animations;
}
