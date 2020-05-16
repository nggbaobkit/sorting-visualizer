export function swap(arr, a, b) {
  let temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
}

export function pushAnimations(animations, arr, a, b) {
  animations.push([a, b]);
  animations.push([a, b]);
  animations.push([a, b, arr[b], arr[a]]);
}

function sortArrayBuiltIn(arr) {
  var fakeArr = arr.slice();
  return fakeArr.sort((a, b) => {
    return a - b;
  });
}

function checkSameArray(arr1, arr2) {
  const l1 = arr1.length;
  const l2 = arr2.length;
  if (l1 !== l2) {
    return false;
  }
  for (let i = 0; i < l1; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

export function isSorted(arr) {
  const sortedArray = sortArrayBuiltIn(arr);
  return checkSameArray(sortedArray, arr);
}
