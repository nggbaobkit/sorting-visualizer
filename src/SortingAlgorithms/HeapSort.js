import { swap, pushAnimations } from './Utilities';

export function getHeapSortAnimations(array) {
  let animations = [];
  doHeapSort(array, animations);
  return animations;
}

function heap_root(array, arrayLength, i, animations) {
  var left = 2 * i + 1;
  var right = 2 * i + 2;
  var max = i;

  if (left < arrayLength && array[left] > array[max]) {
    max = left;
  }

  if (right < arrayLength && array[right] > array[max]) {
    max = right;
  }

  if (max !== i) {
    pushAnimations(animations, array, i, max);
    swap(array, i, max);
    heap_root(array, arrayLength, max, animations);
  }
}

function doHeapSort(array, animations) {
  let arrayLength = array.length;

  for (var i = Math.floor(arrayLength / 2); i >= 0; i -= 1) {
    heap_root(array, arrayLength, i, animations);
  }

  for (i = array.length - 1; i > 0; i--) {
    pushAnimations(animations, array, 0, i);
    swap(array, 0, i);
    heap_root(array, i, 0, animations);
  }
}
