import { swap, pushAnimations } from './Utilities';

export function getHeapSortAnimations(array) {
  let animations = [];
  doHeapSort(array, animations);
  return animations;
}

function heapify(array, arrayLength, i, animations) {
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
    heapify(array, arrayLength, max, animations);
  }
}

function doHeapSort(arr, animations) {
  let array = arr.slice();
  let arrayLength = array.length;

  for (var i = Math.floor(arrayLength / 2); i >= 0; i -= 1) {
    heapify(array, arrayLength, i, animations);
  }

  for (i = array.length - 1; i > 0; i--) {
    pushAnimations(animations, array, 0, i);
    swap(array, 0, i);
    heapify(array, i, 0, animations);
  }
}
