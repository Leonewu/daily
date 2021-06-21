
// 通常和树相关的问题都可以通过递归解决

// 方法一： 递归 + 剪支，复杂度较高 O(2^n)? 

function recursion() {

  // terminator 终止递归
  // process 处理当前层问题
  // drill down(下探下一层，划分子问题，合并子问题)
  // [optional] revert state 清理当前层状态
  if (level > MAX_LEVEL) {
    return;
  }
  process(level, params);
  recursion(level + 1, newParams);

}

// 实现 myPow(x, n)，求 x 的 n 次方
// subset 求子集
// 公共祖先
