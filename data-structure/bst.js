/*
 * @Author: leone
 * @LastEditors  : leone
 * @Description: 
 */
class Node {
  constructor(data, left = null, right = null) {
    this.data = data
    this.left = left
    this.right = right
  }
}

class BST {
  constructor() {
    this.root = null
  }
  /**
   * @data {Node|Number}
   * @return {Boolean}
   */
  add(data) {
    if (data === undefined && data === null) return false
    const source = data.constructor.name === 'Node' ? data : new Node(data)
    let isInserted = false
    if (this.root === null) {
      this.root = source
      isInserted = true
    } else {
      // 可以递归
      // return isInserted = this._insert(source, this.root)
      // 也可以用while，如下
      let target = this.root
      while(target && !isInserted) {
        if (source.data < target.data) {
          if (target.left === null) {
            target.left = source
            isInserted = true
          } else {
            target = target.left
          }
        } else {
          if (target.right === null) {
            target.right = source
            isInserted = true
          } else {
            target = target.right
          }
        }
      }
    }
    return isInserted
  }
  /**
   * @description: recursion递归版本的insert
   * @source {Node}
   * @target {Node}
   * @return {Boolean}
   */
  _insert(source, target) {
    if (source !== null && target !== null && source !== undefined) {
      if (source.data < target.data) {
        if (target.left === null) {
          target.left = source
          return true
        } else {
          return this._insert(source, target.left)
        }
      } else {
        if (target.right === null) {
          target.right = source
          return true
        } else {
          return this._insert(source, target.right)
        }
      }
    }
  }

  remove(data) {
    let target = this.root
    let result = false
    if (data === this.root.data) {
      this.root = null
      result = true
    } else {
      target = this.root
      while (target.left || target.right) {
        if (target.left && target.left.data === data) {
          target.left = null
          result = true
          break
        } else if (target.right && target.right.data === data) {
          target.right = null
          result = true
          break
        } else {
          console.log(target)
          target = data < target.data ? target.left : target.right
        }
      }
    }
    return result
  }
  
  find(data) {
    if (this.root === null || data === null || data === undefined) return null
    let target = this.root
    let result = null
    while (target) {
      if (target.data === data) {
        result = target
        break
      } else if (data < target.data) {
        target = target.left
      } else {
        target = target.right
      }
    }
    return result
  }

  findBFS(data) {
    // BFS
    if (this.root === null || data === null || data === undefined) return null
    const queue = []
    let result = null
    queue.push(this.root)
    while (queue.length) {
      const node = queue.shift()
      if (node.data === data) {
        result = node
        break
      } else {
        if (node.left) {
          queue.push(node.left)
        }
        if (node.right) {
          queue.push(node.right)
        }
      }
    }
    return result
  }

  findDFS(data, target) {
    // DFS
    if (target === null || target === undefined) return null
    let result = null
    if (data === target.data) {
      result = target
    } else {
      result = this._findDFS(data, target.left) || this._findDFS(data, target.right)
    }
    return result
  }

  log() {
    // BFS
    const queue = []
    let log = ''
    queue.push(this.root)
    while(queue.length) {
      const node = queue.shift()
      log += node.data
      node.left && queue.push(node.left)
      node.right && queue.push(node.right)
    }
    console.log(log)
  }

}