import { swap, pushAnimations } from './Utilities';

export function getQuickSortAnimations(array) {
  let quickSortAnimations = [];
  doQuickSort(array, 0, array.length - 1, quickSortAnimations);
  return quickSortAnimations;
}

function partition(arr, start, end, animations) {
  let pivotIndex = start;
  let pivotElement = arr[end];
  for (let i = start; i < end; i++) {
    if (arr[i] < pivotElement) {
      pushAnimations(animations, arr, i, pivotIndex);
      swap(arr, i, pivotIndex);
      pivotIndex++;
    }
  }
  pushAnimations(animations, arr, pivotIndex, end);
  swap(arr, pivotIndex, end);
  return pivotIndex;
}

function doQuickSort(arr, start, end, animations) {
  let array = arr.slice();
  if (start >= end) {
    return;
  }

  const index = partition(array, start, end, animations);
  doQuickSort(array, start, index - 1, animations);
  doQuickSort(array, index + 1, end, animations);
}
