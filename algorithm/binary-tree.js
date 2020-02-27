const node = {
  weight: 1,
  left: {
    weight: 2,
    left: {
      weight: 3,
      left: {
        weight: 4
      },
      right: {
        weight: 5
      }
    },
    right: {
      weight: 6
    }
  },
  right: {
    weight: 7,
    left: {
      weight: 8
    },
    right: {
      weight: 9
    }
  }
}

// 深度优先查找
const dfs_search = (node, target) => {
  if (node.weight === target) {
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
    if (node.weight === target) return node
    if (node.left) que.push(node.left)
    if (node.right) que.push(node.right)
  }
}