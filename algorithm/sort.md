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

归并排序的思路是，将数组分割成最小单元，将相邻的两个最小单元合并成有序子序列  
即先分后合，排序的操作是在合并的时候进行的

```js
function merge(left, right) {
  const result = [];
  while(left.length && right.length) {
    if (left[0] < right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }
  return result.concat(left, right);
}

function mergeSort(arr) {
  if (arr.length === 1) return arr;
  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);
  return merge(mergeSort(left), mergeSort(right));
}
```

时间复杂度为 O(nlgn)

## 快速排序

快排跟归并都是采用分治的思想，区别在于归并处理过程是由下到上，先处理子问题再合并；快排是由上到下，先排序再拆分子问题

```js
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const left = [];
  const pivot = arr[0];
  const middle = [pivot];
  const right = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else if (arr[i] > pivot) {
      right.push(arr[i]);
    } else {
      middle.push(arr[i]);
    }
  }
  return [...quickSort(left), ...middle, ...quickSort(right)];
}
```

### 快排时间复杂度

数组长度为 n 的快排二叉树为，最下面的叶子节点为 1

```
       n
    /     \
  n/2     n/2
  / \     / \
n/4 n/4  n/4 n/4
...
...
  2
 / \
1   1
```

画出快排的二叉树，数组长度为 n，每一层需要执行 n 次，总共有 logn 层，所以为 O(nlogn)
