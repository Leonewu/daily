
import Watcher from './watcher.js'



  /* 转成DocumentFragment */
  function nodeToFragment(el) {
    // 转成fragment相当于浏览器自带的虚拟dom，操作完之后再一次性插入dom中
    var fragment = document.createDocumentFragment();
    var child = el.firstChild;
    while (child) {
      // 将Dom元素移入fragment中
      fragment.appendChild(child);
      child = el.firstChild
    }
    return fragment;
  }

  /* 判断是否为textnode */
  function isTextNode(node) {
    return node.nodeType === Node.TEXT_NODE
  }

  /* 是否为elementnode */
  function isElementNode(node) {
    return node.nodeType === Node.ELEMENT_NODE
  }

  /* 更新节点的text */
  function updateText(node, data) {
    const reg = /\{\{([^\{\}]+)\}\}/g
    const text = node.compileText
    const val = text.replace(reg, (a, exp) => {
      return data[exp]
    })
    node.textContent = val
  }

  /* 编译并且收集依赖 */
  export default function compile(el, data, vm) {
    const children = [].slice.call(el.childNodes)
    const reg = /(?<=\{\{)([^\{\}]+)(?=\}\})/g
    children.forEach(node => {
      if (isTextNode(node) && reg.test(node.textContent)) {
        // 将第一次渲染的模板存起来
        node.compileText = node.textContent
        // 对text节点收集依赖
        node.textContent.match(reg).forEach(key => {
          // new Watcher的时候去做依赖收集，每一个key都有一个watcher
          const watcher = new Watcher(vm, key, function () {
            updateText(node, data)
          })
        })
        // 然后顺便更新了
        updateText(node, data)
      } else if (isElementNode(node)) {
        // element节点 input的v-model处理
        if (node.tagName === 'INPUT' && node.getAttribute('v-model')) {
          const exp = node.getAttribute('v-model')
          node.value = data[exp]
          node.addEventListener('keyup', function (e) {
            if (data[exp] !== e.target.value) {
              data[exp] = e.target.value
            }
          })
          const watcher = new Watcher(vm, exp, function () {
            node.value = data[exp]
          })
        }
      }
      if (node.childNodes.length) {
        compile(node, data, vm)
      }
    })
  }


