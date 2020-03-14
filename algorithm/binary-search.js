
// 在有序数组中找到下标，没有找到返回 -1
const recursion_binary_search = (arr, target, start, end) => {
  start = start || 0
  end = typeof end === 'number' ? end : arr.length - 1
  const mid = parseInt((start + end) / 2)
  if (start > end) return -1
  if (arr[mid] === target) {
    return mid
  } else if (arr[mid] < target) {
    return recursion_binary_search(arr, target, mid + 1, end)
  } else {
    return recursion_binary_search(arr, target, start, mid - 1)
  }
}

const while_binary_search = (arr, target) => {
  let start = 0, end = arr.length - 1
  while (start <= end) {
    const mid = parseInt((start + end) / 2)
    if (arr[mid] === target) {
      return mid
    } else if (arr[mid] < target) {
      start = mid + 1
    } else {
      end = mid - 1
    }
  }
  return -1
}

