const node = {
  val: 1,
  left: {
    val: 2,
    left: {
      val: 3,
      left: {
        val: 4
      },
      right: {
        val: 5
      }
    },
    right: {
      val: 6
    }
  },
  right: {
    val: 7,
    left: {
      val: 8
    },
    right: {
      val: 9
    }
  }
}

// 深度优先查找
const dfs_search = (node, target) => {
  if (node.val === target) {
    return node
  } else {
    let result = null
    if (node.left) {
      result = dfs_search(node.left, target)
    }
    if (!result && node.right) {
      result = dfs_search(node.right, target)
    }
    return result
  }
}

// 广度优先打印出节点
var bfs_print = function (node, target) {
  const que = []
  que.push(node)
  while (que.length !== 0) {
    node = que.pop()
    if (node.val === target) return node
    if (node.left) que.push(node.left)
    if (node.right) que.push(node.right)
  }
}

// 树反转 
function reserve(node) {
  [node.left, node.right] = [node.right, node.left]
  node.left && reverse(node.left)
  node.right && reverse(node.right)
}

// 打印出二叉树的所有路径 ['1 -> 2 -> 3', '1 -> 2 -> 4']
function printPath(node) {
  const res = [];
  function recur(node, path) {
    if (node.val && !node.left && !node.right) {
      res.push(path.concat(node.val));
    }
    node.left && recur(node.left, path.concat(node.val));
    node.right && recur(node.right, path.concat(node.val));
  }
  recur(node, []);
  return res.map(arr => arr.join(' -> '))
}

// 求出某路径之和为 n 的二叉树路径
function findPath(node, target) {
  const res = [];
  function recur(node, path, n) {
    if (!node) return;
    if (node.val === n) {
      res.push(path.concat(node.val));
      return;
    }
    if (node.val < n) {
      node.left && recur(node.left, path.concat(node.val), n - node.val)
      node.right && recur(node.right, path.concat(node.val), n - node.val)
    }
  }
  recur(node, [], target);
  return res.map(arr => arr.join(' -> '));
}


function isPower2(n) {
  // function getNum() {
  //   let num = ''
  //   const indexs = []
  //   while(indexs.length < n) {
  //     // if (index)
  //   }
  //   for (let i = 0; i < n.toString().length; i++) {
  //     num += n[i];
  //   }
  // }
  
}

// 爬梯子
// 每次能爬 1 个阶梯或者 2 个阶梯，求 n 个阶梯的所有方案

function climb(n) {
  const coins = [1, 2];
  // let ways = 0;
  const res = []
  function recur(t, paths = []) {
    for (let i = 0; i < coins.length; i++) {
      if (t - coins[i] === 0) {
        res.push(path.concat(coins[i]));
      } else if (t - coins[i] > 0) {
        recur(t - coins[i], paths.concat(coins[i]));
      }
    }
  }
  recur(n);
  return res;
}

function levelOrder(root) {
  const q = root ? [root] : [];
  const res = [];
  while (q.length) {
    const node = q.shift();
    res.push(node.val);
    node.left && q.push(node.left);
    node.right && q.push(node.right);
  }
  return res;
}