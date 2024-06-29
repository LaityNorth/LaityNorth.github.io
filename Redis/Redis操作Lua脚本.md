---
title: "Redis中使用Lua脚本"
---


## 什么是Lua

Lua是一个轻量、简洁、可扩展的==脚本语言==，它的特点有：

- 轻量：编译后体积很小。
- 简洁：由C编写，启动快，运行快
- 可扩展：可内嵌到各种编程语言或者系统中运行。提升静态语言的灵活性。而且完全不需要担心语法问题。

## 为什么要使用Lua

1、原子性：将Redis的多个操作合成一个脚本，然后整体执行，在脚本的执行中，不会出现资源竞争的问题。

2、减少网络通信：把多个命令何并成一个lua脚本，redis统一执行脚本。

3、复用性：client发送的脚本会永久存储在Redis中，这意味其他的客户端可以服用这个脚本来完成同样的逻辑。


## 如何学习Lua脚本

- 掌握lua的一些基本的命令和操作语法即可
- 怎么执行lua脚本
- 怎么运行lua脚本
- springboot如果去执行lua脚本
- redssion有分布式锁：使用了lua。


### 使用Lua有一个前提

就是你业务逻辑要非常紧密。并且执行的命令是多个。如果是一个简单的执行是不需要用lua去优化。


### Lua语法入门

Redis如何操作lua脚本呢？

```sh
eval script numkeys key [key ...] arg [arg ...]
```

- eval 是执行lua脚本的命令
- script lua脚本
- numkeys key的个数
- key [key ...]: lua脚本中的KEYS名字， key的列表
- arg [arg ...]: lua脚本中的 ARGV 的值。value的列表


```sh
#script代表的是：参数是一段Lua脚本程序，脚本不必（也不应该）定义未一个Lua函数。
numkeys:用于指定key参数的个数
KEYS[KEYS….]：代表redis的KEYS，从evel的第三个参数开始算起，标识在交班中所用到的redis键（KEY）
ARGV[ARGV….]：代表lua的入参，在Lua中通过全局变量的argv数组访问，访问的形式呵呵KEYS变量类似(ARGV[1],ARGV[2])以此类推。
```


#### 入门案例

KEYS 这里的索引是从：1 开始的 ，ARGV也是如此。

```sh
EVAL "return {KEYS[1],KEYS[2],ARGV[1],ARGV[2]}" 2 key1 key2 feige achao
1) "key1"
2) "key2"
3) "feige"
4) "achao"
```

上面代码的含义是：我执行的可以把对应的keys进行填充返回。


先分析一个完整，如下：

>[!danger]注意
Redis默认情况是支持lua脚本，给lua脚本提供了一个redis的对象。这个对象提供call方法，call方法可以调用Redis任何的命令

```lua
-- 成功返回1、没有设置返回0
-- 如果redis没找到。就直接添加
if redis.call('get',KEYS[1]) == nil then
    redis.call('set',KEYS[1],ARGV[1]);
    redis.call('expire',KEYS[1],ARGV[2]);
    return 1;
end

-- 如果旧值等于新值，不进行操作，如果不相同就执行更新
if redis.call('get',KEYS[1]) == ARGV[1] then
    return 0;
else
    redis.call('set',KEYS[1],ARGV[1]);
    return 1;
end
```

翻译成java代码

```java
// 成功返回1、没有设置返回0
// 如果redis没找到。就直接添加
public Integer makerun(String keys1,String value1){
    if(redistemplate.get(keys1) == null){
	   redistemplate.set(keys1,value1);
       // saveorder //err--原子性：共生公死 --- 分布锁---死锁
       // 扣减库存 //err--原子性：共生公死 --- 分布锁---死锁
       // 发消息 //err--原子性：共生公死 --- 分布锁---死锁
       redistemplate.expire(keys1,value1);
	}
	if(redistemplate.get(keys1) == value1){
	   return 0;
	}else{
	   redistemplate.set(keys1,value1);
	   return 1;
	}
}

// 执行lua脚本
public Integer makerun(String keys1,String value1){
	int value = redistemplate.evalscript("user.lua")
}
```

