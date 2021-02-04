# 移动端 autocomplete 远程搜索

## 首要考虑的问题

1. 输入过程中，debounce，清空输入框时不需要 debounce，不会发出请求，马上清除结果，并且阻止默认事件，防止失焦
2. 如果上个请求还没响应，需要 cancel 请求，否则会出现数据错乱
3. 当搜索结果过多的时候，需要滚动加载（throttle）和虚拟列表

## 需要处理的样式及其他问题

1. 手写 input 样式 搜索图标，清除文本图标，placeholder，圆角
2. input 搜索过程中 loading 样式和加载列表时的 loading 样式
3. input 框可能需要 sticky
4. input 输入中文时会先填充英文字母，输入过程中会触发 input 事件，但实际上这种情况是不需要触发 input 事件的，而是等中文输入完之后再触发 input 的搜索。解决方法：监听 input 的 compositionstart 和 compositionend 事件，start 的时候设置一个变量为 true，说明是在输入中文，在 input 事件中判断这个变量 为 true 的时候 return，在 compositionend 事件中 触发搜索
5. 在 IOS 中，input 聚焦时，手机键盘会弹出，弹出后一遍滚动搜索结果，体验会很差，因为此时会出现两个滚动条（整个页面的滚动条和搜索结果的滚动条），导致很难滑动搜索列表，需要 hover 大概 1s 才能够滑动。解决方法：在搜索列表的 touchstart 事件中对 input 手动失焦，将键盘收起
6. input 输入完失焦时隐藏搜索列表，但要注意一种情况：input 输入中，此时键盘弹出，输入完毕，滑动搜索结果列表或者点击 IOS 键盘上的完成按钮。这种情况下不需要隐藏搜索列表
7. 移动端 autoPrefixer 可能会把超出省略号的属性给去掉，加上以下代码

```/*! autoprefixer: ignore next*/
    -webkit-box-orient: vertical;
```

## 参考

- 微信的搜索框
