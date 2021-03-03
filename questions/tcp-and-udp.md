# tcp & udp

## tcp

tcp 是面向连接，全双工的协议，建立和断开连接需要双方的确认。
头部报文最少 20 字节，最大 60 字节，具有发送应答机制和超时重传机制
应用：

- HTTP，HTTPS
- SSH
- FTP
- SMTP，IMAP/POP

6 种 tcp 标志位：

- SYN(synchronous 建立联机)
- ACK(acknowledgement 确认)
- PSH(push 传送)
- FIN(finish 结束)
- RST(reset 重置)
- URG(urgent 紧急)  

2 个参数：

- Sequence number(顺序号码)
- Acknowledge number(确认号码)

### 三次握手

由于信道是不可靠的，请求报文可能会因为某些原因在网络节点滞留或者丢失，需要三次握手这种发送应答机制确认正常连接

1. 客户端生成随机数 x，发送 SYN 标志位，seq = x 到服务端
2. 服务端接收后，生成随机数 y，发送 SYN 和 ACK 标志位，seq = y，ack_num = x + 1 到客户端
3. 客户端接收后，发送 ACK 标志位，ack_num = y + 1 到服务端
4. 服务端建立连接

### 四次挥手

不管是客户端还是服务端，关闭连接都需要准备，当收到关闭连接的消息之后，另外一端准备完毕后才会关闭连接

1. 客户端生成随机数 x，发送 FIN 标志位，seq = x 到服务端
2. 服务端接收后，发送 ACK 标志位，ack_num = x + 1 到客户端，表示收到消息
3. 服务端准备好之后，生成随机数 y，发送 FIN 标志位，seq = y 到客户端
4. 客户端收到后，发送 ACK 标志位，ack_num = y + 1 到服务端，表示收到消息，可以关闭了
5. 服务端关闭连接

## udp

udp 是面向无连接的协议，不需要三次握手，头部报文只有 8 字节  
应用：DNS 域名系统  
UDP 头部包含了以下几个数据：

- 两个十六位的端口号，分别为源端口（可选字段）和目标端口
- 整个数据报文的长度
- 整个数据报文的检验和（IPv4 可选 字段），该字段用于发现头部信息和数据中的错误

## 区别

- tcp 是面向连接，全双工的，建立和断开连接需要双方的确认
- tcp 保证了可靠性和时序性，具有发送应答机制和超时重传机制
- udp 具有高效性，但容易丢包，不保证数据顺序
- tcp 头部最少 20 字节，udp 头部为 8 字节

# 参考

- [一文搞懂TCP与UDP的区别](https://www.cnblogs.com/fundebug/p/differences-of-tcp-and-udp.html)