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
