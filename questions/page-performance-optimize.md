### 题目

商城的列表页跳转到商品的详情页，详情页数据接口很慢，前段可以怎么优化用户体验？

### 一、优化简要版

**1）懒加载:获取首屏数据,后边的数据进行滑动加载请求**

1. 首先，不要将图片地址放到src属性中，而是放到其它属性(data-original)中。
2. 页面加载完成后，根据scrollTop判断图片是否在用户的视野内，如果在，则将data-original属性中的值取出存放到src属性中。
3. 在滚动事件中重复判断图片是否进入视野，如果进入，则将data-original属性中的值取出存放到src属性中

**2）利用骨架屏提升用户体验**

**3）PreloadJS预加载**

使用PreloadJS库，PreloadJS提供了一种预加载内容的一致方式，以便在HTML应用程序中使用。预加载可以使用HTML标签以及XHR来完成。默认情况下，PreloadJS会尝试使用XHR加载内容，因为它提供了对进度和完成事件的更好支持，但是由于跨域问题，使用基于标记的加载可能更好。

**4）除了添加前端loading和超时404页面外，接口部分可以添加接口缓存和接口的预加载**

1. 使用workbox对数据进行缓存 缓存优先
2. 使用orm对本地离线数据进行缓存 优先请求本地。
3. 采用预加载 再进入到详情页阶段使用quicklink预加载详情页
4. 使用nodejs作为中间层将详情页数据缓存至redis等
上面的方法，可以根据业务需求选择组合使用。

### 二、优化详细版

#### 1.打开谷歌搜索为例

![load和DOMContentLoad.png](http://img-static.yidengxuetang.com/wxapp/issue-img/qid-693-devetool.png)

- 蓝色的分界线左边代表浏览器的 DOMContentLoaded，当初始 HTML 文档已完全加载和解析而无需等待样式表，图像和子帧完成加载时的标识;
- 红色分界线代表 load, 当整个页面及所有依赖资源如样式表和图片都已完成加载时

所以我们可以大致分为在

- **TTFB 之前的优化**
- **浏览器上面渲染的优化**

#### 2.当网络过慢时在获取数据前的处理

首先先上一张经典到不能再经典的图

![timing-overview.png](http://img-static.yidengxuetang.com/wxapp/issue-img/qid-693-performance.png)

> 其中cnd在dns阶段, dom渲染在processing onload阶段

上图从 promot for unload 到 onload 的过程这么多步骤, 在用户体验来说, 一个页面从加载到展示超过 4 秒, 就会有一种非常直观的卡顿现象, 其中 load 对应的位置是 onLoad 事件结束后, 才开始构建 dom 树, 但是用户不一定是关心当前页面是否是完成了资源的下载;
往往是一个页面开始出现可见元素开始**FCP 首次内容绘制**或者是**FC 首次绘制** 此时用户视觉体验开始, 到**TTI(可交互时间)** , 可交互元素的出现, 意味着,用户交互体验开始, 这时候用户就可以愉快的浏览使用我们的页面啦;

所以这个问题的主要痛点是需要缩短到达 **TTI** 和 **FCP** 的时间

但是这里已知进入我们详情页面时, 接口数据返回速度是很慢的, **FCP** 和 **FC** , 以及加快到达 **TTI** , 就需要我们页面预处理了

#### 3.页面数据缓存处理(缓存大法好)

**第一次** 进入详情页面, 可以使用骨架图进行模拟 **FC** 展示, 并且骨架图, 可使用背景图且行内样式的方式对首次进入详情页面进行展示, 对于请求过慢的详情接口使用 **worker** 进程, 对详情的接口请求丢到另外一个工作线程进行请求, 页面渲染其他已返回数据的元素; 当很慢的数据回来后, 需要对页面根据商品 id 签名为 key 进行 webp 或者是缩略图商品图的 cnd 路径 localStorage 的缓存, 商品 id 的签名由放在 cookie 并设置成 httpOnly

**非第一次** 进入详情页时, 前端可通过特定的接口请求回来对应的商品 id 签名的 cookieid, 读取 localStorage 的商品图片的缓存数据, 这样对于第一次骨架图的展示时间就可以缩短, 快速到达 **TTI** 与用户交互的时间, 再通过 worker 数据, 进行高清图片的切换

#### 4.过期缓存数据的处理(后端控制为主, LRU 为辅)

对于缓存图片地址的处理, 虽说缓存图片是放在 localStorage 中, 不会用大小限制, 但是太多也是不好的, 这里使用 LRU 算法对图片以及其他 localStorage 进行清除处理, 对于超过 7 天的数据进行清理
localStorage 详情页的数据, 数据结构如下:

```js
"读取后端的cookieID": {
  "path": "对应cdn图片的地址",
  "time": "缓存时间戳",
  "size": "大小"
}
```

#### 5.数据缓存和过期缓存数据的处理主体流程

![进入商品详情页,接口数据很慢时,对页面的优化](http://img-static.yidengxuetang.com/wxapp/issue-img/qid-693-handle.png)

#### 6.对于大请求量的请求(如详情页面中的猜你喜欢, 推荐商品等一些大数据量的静态资源)

1. 由于这些不属于用户进入详情想第一时间获取的信息, 即不属于当前页面的目标主体, 所以这些可以使用 **Intersection Observer API** 进行主体元素的观察, 当当前主体元素被加载出来后, 在进行非主体元素的网络资源分配, 即网络空闲时再请求猜你喜欢, 推荐商品等资源, 处理请求优先级的问题
2. 需要保证当前详情页的请求列表的请求数 不超过当前浏览器的请求一个 tcp 最大 http 请求数

#### 7.当 worker 数据回来后, 出现 **大量图片** 替换对应元素的的 webp 或者缩略图出现的问题(静态资源过多)

这里有两种情景

1. 移动端, 对于移动端, 一般不会出现大量图片, 一般一个商品详情页, 不会超过 100 张图片资源; 这时候, 选择懒加载方案; 根据 GitHub 现有的很多方案, 当前滑动到可被观察的元素后才加载当前可视区域的图片资源, 同样使用的是 **Intersection Observer API** ; 比如 vue 的一个库 **vue-lazy** , 这个库就是对 Intersection_Observer_API 进行封装, 对可视区域的 img 便签进行 data-src 和 src 属性替换

2. 第二个情况, pc 端, 可能会出现大量的 img 标签, 可能多达 300~400 张, 这时候, 使用懒加载, 用户体验就不太好了; 比如说: 当用户在查看商品说明介绍时, 这些商品说明和介绍有可能只是一张张图片, 当用户很快速的滑动时, 页面还没懒加载完, 用户就有可能看不到想看的信息; 鉴于会出现这种情况, 这里给出一个方案就是, img 出现一张 load 一张; 实现如下：

```js
// 这里针对非第一次进入详情页,
//当前localStorage已经有了当前详情页商品图片的缩略图
for(let i = 0; i < worker.img.length; i++) {
  // nodeList是对应img标签,
  // 注意, 这里对应的nodeList一定要使用内联style把位置大小设置好, 避免大量的重绘重排
  const img = nodeList[i]
  img.src = worker.img['path'];
  img.onerror = () => {
    // 将替换失败或者加载失败的图片降级到缩略图,
    // 即缓存到localStorage的缩略图或者webp图
    // 兼容客户端处理webp失败的情况
  }
}
```

#### 8.页面重绘重排处理

![页面渲染流程](http://img-static.yidengxuetang.com/wxapp/issue-img/qid-693-paint.png)

触发重排的操作主要是几何因素：

1. 页面首次进入的渲染。
2. 浏览器 resize
3. 元素位置和尺寸发生改变的时候
4. 可见元素的增删
5. 内容发生改变
6. 字体的 font 的改变。
7. css 伪类激活。
   .....
  </br>
  
尽量减少上面这些产生重绘重排的操作

比如说：

这里产生很大的重绘重排主要发生在 worker 回来的数据替换页面中的图片 src 这一步

```js
// 该节点为img标签的父节点
const imgParent = docucment.getElementById('imgParent');
// 克隆当前需要替换img标签的父元素下所有的标签
const newImgParent = imgParent.cloneNode(true);
const imgParentParent = docucment.getElementById('imgParentParent');
for(let i = 0; i < newImgParent.children.length; i++) {
// 批量获取完所有img标签后, 再进行重绘
  newImgParent.children[i].src = worker.img[i].path;
}
// 通过img父节点的父节点, 来替换整个img父节点
// 包括对应的所有子节点, 只进行一次重绘操作
imgParentParent.replaceChild(newImgParent, imgParent);
```

#### 9.css代码处理

**注意被阻塞的css资源**

众所周知, css的加载会阻塞浏览器其他资源的加载, 直至CSSOM **CSS OBJECT MODEL** 构建完成, 然后再挂在DOM树上, 浏览器依次使用渲染树来布局和绘制网页。

很多人都下意识的知道, 将css文件一律放到head标签中是比较好的, 但是为什么将css放在head标签是最后了呢?

我们用淘宝做例子

![没有加载css的淘宝页面](http://img-static.yidengxuetang.com/wxapp/issue-img/qid-693-taobao.png)
比如这种没有css样式的页面称之为FOUC(内容样式短暂失效), 但是这种情况一般出现在ie系列以及前期的浏览器身上; 就是当cssom在domtree生成后, 依然还没完成加载出来, 先展示纯html代码的页面一会再出现正确的带css样式的页面;

**减少不同页面的css代码加载**

对于电商页面, 有些在头部的css代码有些是首页展示的有些是特定情况才展示的, 比如当我们需要减少一些css文件大小但是当前网站又需要多屏展示, 这时候, 很多人都会想到是媒体查询, 没错方向是对的, 但是怎样的媒体查询才对css文件保持足够的小呢, 可以使用link标签媒体查询,看下边的的例子：

```html
<link href="base.css" rel="stylesheet">
<link href="other.css" rel="stylesheet" media="(min-width: 750px)">
```

第一个css资源表示所有页面都会加载, 第二个css资源, 宽度在750px才会加载, 默认media="all"

在一些需求写css媒体查询的网站, 不要在css代码里面写, 最好写两套css代码, 通过link媒体查询去动态加载, 这样就能很好的减轻网站加载css文件的压力

#### 10.静态js代码处理

这种js代码, 是那些关于埋点, 本地日记, 以及动态修改css代码, 读取页面成型后的信息的一些js代码, 这种一律放在同域下的localStorage上面, 什么是同域下的localStorage

这里还是以天猫为例

![](http://img-static.yidengxuetang.com/wxapp/issue-img/qid-693-tianmao.png)

#### 11.容错处理

1. 页面在获取到 worker 回来的数据后, 通过拷贝整个html片段, 再将worker的img路径在替换对应的 img 资源后再进行追加到对应的dom节点
2. 缓存 css 文件和 js 文件到 localStorage 中, 若当前没有对应的 css 文件或者 js 文件, 或者被恶意修改过的 css 文件或者 js 文件(可使用签名进行判断), 删除再获取对应文件的更新

#### 12.推荐方案理由

1. 使用了 worker 线程请求详情数据, 不占用浏览器主线程; 进而减少主进程消耗在网络的时间
2. 使用 localStorage 的缓存机制, 因为当 worker 回来的数据后, 读取 localStorage 是同步读取的, 基本不会有太大的等待时间, 并且读取 localStorage 时, 使用的是后端返回来的 cookieID 进行读取, 且本地的 cookID 是 httpOnly 避免了第三方获取到 cookieID 进行读取商品信息
3. 使用 LRU 清除过多的缓存数据
4. 首次进入页面时, 保证已知页面布局情况下的快速渲染以及配置骨架图, 加快到达 FCP 和 FP 的时间
5. 就算 img 静态资源过大, 在第二次进入该页面的时候, 也可以做到低次数重绘重排, 加快到底 TTI 的时间

#### 13.方案不足

1. 在网络依然很慢的情况下, 首次进入详情页面, 如果长时间的骨架图和已知布局下, 用户的体验依然是不好的, 这里可以考虑 PWA 方案, 对最近一次成功请求的内容进行劫持, 并在无网情况下, 做出相应的提示和展示处理
2. 需要 UI 那边提供三套静态 img 资源
