# 排序算法

## 冒泡排序

冒泡排序，就是让最大的数往右边冒，一轮下来，最右边的数肯定是最大的

```js
function bubbleSort(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    }
  }
  return arr;
}
```

计算次数为 n ^ 2 - n，这里减去 n 是因为每一轮都会减少 1 次，时间复杂度为 O(n)

## 归并排序
