
// 在有序数组中找到下标，没有找到返回 -1
const recursion_binary_search = (arr, target, start, end) => {
  start = start || 0
  end = typeof end === 'number' ? end : arr.length - 1
  const mid = Math.floor((start + end) / 2)
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
    const mid = Math.floor((start + end) / 2)
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

function binarySearch(arr, target, offset = 0) {
  if (arr.length === 1) {
    if (arr[0] === target) { 
        return offset;
    } else {
      return -1;
    }
  } 
  const index = Math.floor(arr.length / 2)
  if (arr[index] < target) {
    return binarySearch(arr.slice(index, arr.length), target, offset + index);
  }
  if (arr[index] > target) {
    return binarySearch(arr.slice(0, index), target, offset);
  }
  if (arr[index] === target) { 
    return offset + index;
  }
  return -1;
}

// 二分查找应用
// 在有序数组中寻找某个数字出现的次数
// https://leetcode-cn.com/problems/zai-pai-xu-shu-zu-zhong-cha-zhao-shu-zi-lcof/
// search([5,7,7,8,8,10], 6) => 0
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
 var search = function(nums, target) {
  if (nums.length <= 1) {
     return (nums.length === 1 && nums[0] === target) ? 1 : 0;
   }
   let times = 0;
   const index = Math.floor(nums.length / 2);
   if (nums[index] === target) {
     times++;
     let leftIndex = index;
     let rightIndex = index;
     let leftEnd = false;
     let rightEnd = false;
     while (!leftEnd || !rightEnd) {
       if (leftIndex === 0) {
         leftEnd = true;
       }
       leftIndex--;
       if (target === nums[leftIndex]) {
         times++;
       } else {
         leftEnd = true;
       }
       if (rightIndex === nums.length - 1) {
         rightEnd = true;
       }
       rightIndex++;
       if (target === nums[rightIndex]) {
         times++;
       } else {
         rightEnd = true;
       }
     }
   }
   if (nums[index] > target) {
     times += search(nums.slice(0, index), target);
   }
   if (nums[index] < target) {
     times += search(nums.slice(index, nums.length), target);
   }
   return times;
 };



// 二分查找的复杂度分析
// 时间复杂度
// 最坏情况下
// 最优情况下
// 平均


// 空间复杂度
// 最坏情况下
// 最优情况下
// 平均