# 浏览器缓存

浏览器对静态资源发起请求的时候，会先检查强缓存（expires http1.0和cache-control http1.1），
cache-control
public：所有内容都将被缓存（客户端和代理服务器都可缓存）

private：所有内容只有客户端可以缓存，Cache-Control的默认取值

no-cache：客户端缓存内容，但是是否使用缓存则需要经过协商缓存来验证决定

no-store：所有内容都不会被缓存，即不使用强制缓存，也不使用协商缓存

max-age=xxx (xxx is numeric)：缓存内容将在xxx秒后失效

## 强缓存

expired
cache-control

## 协商缓存

last-modified
etag

## service worker

## 缓存查询发生在哪一步
