---
title: "Redis缓存雪崩"
---

## Redis缓存雪崩

- 在同一时刻大量的请求进来，
- 缓存同一时刻大量key过期，比如你缓存了10W秒杀的商品。
- 解决方案：
  - 给缓存的key过期时间进行错开
  - 多级缓存Redis----> memcache--->db
  - 考虑使用第三方的Redis -阿里云的redis

能完成的解决雪崩现象么？很难，不可能完全解决。


## Redis的故障概念

### 什么是Redis穿透

其实就指在开发中，用户或者黑客请求一些无用的业务id请求，比如一个商品详情，正常的逻辑就根据商品Id去查询。

如果这个时候，查询一个不存在的商品id，在高并发场景下，就会造成缓存穿透的现象，解决方案就是：给不存在的商品id也存入Redis缓存中，同时给他设置时间过期即可。

设置的原因就是：腾出内存空间，因为这种数据本身就垃圾数据。但是为了不冲入数据库中的一种解决方案。

当然你要可以使用布隆过滤器，但是布隆过滤本身不是Redis的自身的组件，你必须额外安装Redis的布隆插件。而且布隆过滤器存在一定的误判率，所以在开发中如果是对幂等性要求很高的情况下，是不允许使用布隆过滤器，但是在一些用户行为推荐，ip黑名单的场景下，使用布隆过滤器解决的过滤是极好解决方案

### 什么是缓存雪崩

在同一时刻大量的请求进来，缓存同一时刻大量key过期，比如你缓存了10W秒杀的商品。就会造成雪崩，一旦雪崩就造成缓存击穿或者穿透。解决方案：

- 给缓存的key过期时间进行错开即可（增加随机数）
- 二级缓存 Redis ----> memcache（缓存框架-jvm级别）--->db
- 考虑使用第三方的redis -阿里云的redis


### 什么是缓存击穿


在同一时刻大量的请求进来，缓存同一时刻大量key过期，缓存雪崩造成的现象就击穿。

- 因为在更换数据的时候，删除的和清空了缓存，用户端这边的话大量请求在进行读，刚好在更换商品的时候，把缓存给删除了。写入还没完成或者正在写入，就因为这个删除和写入的间隙就造成的缓存击穿现象。
- 主从备份数据的解决方案，先从master进行读取，如果击穿从slave进行读取，那么在更换数据的时候，先删除salve的数据，在放入slave,然后在master数据，在放入master中，进行错开即可。

>[!tip]总结
其实就是无论是穿透也好，雪崩也好，击穿也好其实都是在并发量很大的情况下，造成的不进缓存进的一种现象。

