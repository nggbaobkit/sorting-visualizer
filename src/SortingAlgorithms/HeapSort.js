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
    animations.push([i, max]);
    animations.push([i, max]);
    animations.push([i, max, array[max], array[i]]);
    swap(array, i, max);
    heap_root(array, arrayLength, max, animations);
  }
}

function swap(array, index_A, index_B) {
  var temp = array[index_A];

  array[index_A] = array[index_B];
  array[index_B] = temp;
}

function doHeapSort(array, animations) {
  let arrayLength = array.length;

  for (var i = Math.floor(arrayLength / 2); i >= 0; i -= 1) {
    heap_root(array, arrayLength, i, animations);
  }

  for (i = array.length - 1; i > 0; i--) {
    animations.push([0, i]);
    animations.push([0, i]);
    animations.push([0, i, array[i], array[0]]);
    swap(array, 0, i);
    heap_root(array, i, 0, animations);
  }
}
