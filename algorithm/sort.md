# 排序算法

排序是常见的面试题，一般只需了解几种效率高的排序就够了，并且也要掌握稳定性，时间复杂度和空间复杂度。

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
最优的情况下，每次拿到的 pivot 都能平分数组，也就是上面的二叉树模型，时间复杂度为 O(nlogn)  
最差的情况下，每次拿到的 pivot 是最小或者最大值，这种情况，就相当于冒泡排序，时间复杂度为 O(n^2)

### 快排空间复杂度

快排为递归算法，空间复杂度为递归的深度  
最优情况下，就是完美的二叉树模型，空间复杂度为二叉树的层数 O(logn)  
最差情况下，为冒泡排序的空间复杂度 O(n)

### 原地快排

原地快排的优点是只进行数组的元素交换，不需要创建新的数组
要点：分区，返回原数组

```js
function quickSort(a, l, r) {
  if (a.length > 1) {
    const i = partition(a, l, r);
    if (l < i - 1) {
      quickSort(a, l, i - 1);
    } 
    if (i + 1 < r) {
      quickSort(a, i + 1, r);
    }
  }
  return a;
  function partition(a, l, r) {
    let p = a[Math.floor((l + r) / 2)];
    let i = l;
    let j = r;
    while(i <= j) {
      while(a[i] < p) {
        i++;
      }
      while (a[j] > p) {
        j--;
      }
      if (i <= j) {
        [a[i], a[j]] = [a[j], a[i]];
        i++;
        j--;
      }
    }
    return i;
  }
}
```

```js
function quickSort(a, l, r) {
  if (a.length > 1) {
    let index = partition(a, l ,r);
    if (index - 1 > l) {
      quickSort(a, l, index - 1);
    }
    if (index + 1 < r) {
      quickSort(a, index + 1, r);
    }
  }
  return a;
  function partition(a, l, r) {
    const p = a[l];
    let i = l;
    let j = r;
    while(i !== j) {
      while(a[j] >= p && i < j) {
        j--;
      }
      while(a[i] <= p && i < j) {
        i++;
      }
      if (i < j) {
        [a[i], a[j]] = [a[j], a[i]];
      }
    }
    [a[i], a[l]] = [a[l], a[i]];
    return i;
  }
}
```
