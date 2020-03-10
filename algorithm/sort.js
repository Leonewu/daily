
// quickSort 分治思想

const simple_quicksort = function(arr) {
  if (arr.length < 1) return arr
  let left = [], right = [], pivot = arr[0], center = [pivot]
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else if (arr[i] > pivot) {
      right.push(arr[i])
    } else {
      center.push(arr[i])
    }
  }
  return [...simple_quicksort(left), ...center, ...simple_quicksort(right)]
}