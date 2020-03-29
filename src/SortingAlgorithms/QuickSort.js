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
      animations.push([i, pivotIndex]);
      animations.push([i, pivotIndex]);
      animations.push([i, pivotIndex, arr[pivotIndex], arr[i]]);
      swap(arr, i, pivotIndex);
      pivotIndex++;
    }
  }
  animations.push([pivotIndex, end]);
  animations.push([pivotIndex, end]);
  animations.push([pivotIndex, end, arr[end], arr[pivotIndex]]);
  swap(arr, pivotIndex, end);
  return pivotIndex;
}

function swap(arr, a, b) {
  let tmp = arr[a];
  arr[a] = arr[b];
  arr[b] = tmp;
}

function doQuickSort(array, start, end, animations) {
  if (start >= end) {
    return;
  }

  const index = partition(array, start, end, animations);
  doQuickSort(array, start, index - 1, animations);
  doQuickSort(array, index + 1, end, animations);
}
