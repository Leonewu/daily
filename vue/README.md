# 注意事项
核心内容：  
1. 依赖收集（对data中的每一个属性都劫持getter，在watcher初始化的时候）
2. 变化通知（setter通知Dep，Dep再负责通知到每一个subscriber）
3. 语法解析（compile，递归遍历dom tree中的每一个element节点和text节点，对text节点根据key找到data中的值，然后进行替换，对element节点进行指令处理和事件处理）
### 遇到的问题
1. defineproperty传入set和get的时候不能传value和writable 
2. 浏览器如果使用import语法的话，要在script标签上加入type="module"
## 参考
[vue 的双向绑定原理及实现（掘金）]('https://juejin.im/entry/5923973da22b9d005893805a)